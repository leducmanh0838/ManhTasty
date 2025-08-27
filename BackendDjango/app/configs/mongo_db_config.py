from django.conf import settings
from pymongo import MongoClient

client = MongoClient(host=settings.MONGODB_SETTINGS['HOST'], port=settings.MONGODB_SETTINGS['PORT'])
db = client[settings.MONGODB_SETTINGS['DB_NAME']]
# collection
search_collection = db['search']
recipe_drafts_collection = db['recipe_drafts']
view_collection = db['view']