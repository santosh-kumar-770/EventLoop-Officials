from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0001_initial'),
    ]

    operations = [
        migrations.AddField(model_name='profile', name='major', field=models.CharField(blank=True, max_length=200)),
        migrations.AddField(model_name='profile', name='year', field=models.CharField(blank=True, max_length=10, choices=[('1','First Year'),('2','Second Year'),('3','Third Year'),('4','Fourth Year'),('5','Fifth Year+'),('alumni','Alumni')])),
        migrations.AddField(model_name='profile', name='interests', field=models.CharField(blank=True, max_length=300)),
        migrations.AddField(model_name='profile', name='linkedin', field=models.URLField(blank=True)),
        migrations.AddField(model_name='profile', name='twitter', field=models.CharField(blank=True, max_length=100)),
    ]