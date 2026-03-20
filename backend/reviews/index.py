import json
import os
import psycopg2
from datetime import datetime


def get_conn():
    return psycopg2.connect(os.environ['DATABASE_URL'])


def handler(event: dict, context) -> dict:
    """Управление отзывами: получение, создание, обновление статуса, реакции, удаление."""
    cors = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
    }

    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': cors, 'body': ''}

    method = event.get('httpMethod', 'GET')
    params = event.get('queryStringParameters') or {}
    body = json.loads(event.get('body') or '{}')
    action = params.get('action') or body.get('action')

    conn = get_conn()
    cur = conn.cursor()

    try:
        # GET /reviews — получить все отзывы
        if method == 'GET':
            cur.execute(
                'SELECT id, name, text, rating, date, status, likes, dislikes FROM reviews ORDER BY created_at DESC'
            )
            rows = cur.fetchall()
            reviews = [
                {
                    'id': r[0], 'name': r[1], 'text': r[2],
                    'rating': r[3], 'date': r[4], 'status': r[5],
                    'likes': r[6], 'dislikes': r[7], 'userReaction': None
                }
                for r in rows
            ]
            return {'statusCode': 200, 'headers': cors, 'body': json.dumps(reviews, ensure_ascii=False)}

        # POST /reviews — создать отзыв
        if method == 'POST' and not action:
            review_id = str(int(datetime.now().timestamp() * 1000))
            cur.execute(
                'INSERT INTO reviews (id, name, text, rating, date, status, likes, dislikes) VALUES (%s,%s,%s,%s,%s,%s,%s,%s)',
                (review_id, body['name'], body['text'], body['rating'],
                 body.get('date', datetime.now().strftime('%Y-%m-%d')),
                 'pending', 0, 0)
            )
            conn.commit()
            review = {
                'id': review_id, 'name': body['name'], 'text': body['text'],
                'rating': body['rating'], 'date': body.get('date', datetime.now().strftime('%Y-%m-%d')),
                'status': 'pending', 'likes': 0, 'dislikes': 0, 'userReaction': None
            }
            return {'statusCode': 201, 'headers': cors, 'body': json.dumps(review, ensure_ascii=False)}

        # PUT /reviews?action=status — изменить статус
        if method == 'PUT' and action == 'status':
            cur.execute(
                'UPDATE reviews SET status = %s WHERE id = %s',
                (body['status'], body['id'])
            )
            conn.commit()
            return {'statusCode': 200, 'headers': cors, 'body': json.dumps({'ok': True})}

        # PUT /reviews?action=react — лайк/дизлайк
        if method == 'PUT' and action == 'react':
            review_id = body['id']
            reaction = body['reaction']  # 'like', 'dislike', or None
            prev = body.get('prev')  # предыдущая реакция пользователя

            cur.execute('SELECT likes, dislikes FROM reviews WHERE id = %s', (review_id,))
            row = cur.fetchone()
            if not row:
                return {'statusCode': 404, 'headers': cors, 'body': json.dumps({'error': 'not found'})}

            likes, dislikes = row

            # Убираем старую реакцию
            if prev == 'like':
                likes = max(0, likes - 1)
            elif prev == 'dislike':
                dislikes = max(0, dislikes - 1)

            # Добавляем новую
            if reaction == 'like':
                likes += 1
            elif reaction == 'dislike':
                dislikes += 1

            cur.execute(
                'UPDATE reviews SET likes = %s, dislikes = %s WHERE id = %s',
                (likes, dislikes, review_id)
            )
            conn.commit()
            return {'statusCode': 200, 'headers': cors, 'body': json.dumps({'likes': likes, 'dislikes': dislikes})}

        # DELETE /reviews — удалить отзыв
        if method == 'DELETE':
            review_id = params.get('id') or body.get('id')
            cur.execute('DELETE FROM reviews WHERE id = %s', (review_id,))
            conn.commit()
            return {'statusCode': 200, 'headers': cors, 'body': json.dumps({'ok': True})}

        return {'statusCode': 400, 'headers': cors, 'body': json.dumps({'error': 'unknown request'})}

    finally:
        cur.close()
        conn.close()
