import uuid
from django.db import models

class News(models.Model):
    CATEGORY_CHOICES = [
        ('name', 'Name'),
        ('price', 'Price'),
        ('description', 'Description'),
        ('thumbnail', 'Thumbnail'),
        ('category', 'Category'),
        ('is_featured', 'Is_Featured'),
    ]
    
    name = models.CharField(max_length=100)
    price = models.IntegerField()
    description = models.TextField()
    thumbnail = models.URLField(blank=True, null=True)
    category = models.CharField(max_length=100, choices=CATEGORY_CHOICES)
    is_featured = models.BooleanField(default=False)
    