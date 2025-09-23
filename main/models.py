import uuid
from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator, MaxValueValidator

class Product(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True)
    CATEGORY_CHOICES = [
    ('jersey', 'Jersey'),
    ('shoes', 'Sepatu'),
    ('ball', 'Bola'),
    ('accessories', 'Aksesoris'),
    ('equipment', 'Peralatan Latihan'),
    ('bag', 'Tas Olahraga'),
    ]
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100)
    price = models.IntegerField()
    description = models.TextField()
    stock = models.IntegerField(default=0)
    rating = models.DecimalField(max_digits=3, decimal_places=2, default=0.0, validators=[MinValueValidator(0.0), MaxValueValidator(5.0)])
    thumbnail = models.URLField(blank=True, null=True)
    category = models.CharField(max_length=100, choices=CATEGORY_CHOICES)
    is_featured = models.BooleanField(default=False)


    def __str__(self):
        return self.title
