import uuid
from django.db import models
class Product(models.Model):

    CATEGORY_CHOICES = [
    ('jersey', 'Jersey'),
    ('shoes', 'Sepatu'),
    ('ball', 'Bola'),
    ('accessories', 'Aksesoris'),
    ('equipment', 'Peralatan Latihan'),
    ('bag', 'Tas Olahraga'),
    ]

    name = models.CharField(max_length=100)
    price = models.IntegerField()
    description = models.TextField()
    stock = models.IntegerField(default=0)
    rating = models.DecimalField(max_digits=3, decimal_places=2, default=0.0)
    thumbnail = models.URLField(blank=True, null=True)
    category = models.CharField(max_length=100, choices=CATEGORY_CHOICES)
    is_featured = models.BooleanField(default=False)

    def __str__(self):
        return self.title
