from django.db import models
from django.contrib import admin
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from django.db.models.signals import post_save
from django.dispatch import receiver


class Student(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    time_spent = models.DecimalField(max_digits=5, decimal_places=2, default=0)  # minutes
    questions_answered = models.IntegerField(default=0)
    questions_correct = models.IntegerField(default=0)

    def __str__(self):
        return self.user.username

    @admin.display(
        ordering='questions_answered',
        description='Percent correct by number of questions',
    )
    def percent_correct_lifetime(self):
        if self.questions_answered > 0:
            return (self.questions_correct / self.questions_answered) * 100
        else:
            return 0

    @staticmethod
    def authenticate_user(username, password):
        user = authenticate(username=username, password=password)
        return user

    @receiver(post_save, sender=User)
    def create_user_profile(sender, instance, created, **kwargs):
        if created:
            Student.objects.create(user=instance)

    @receiver(post_save, sender=User)
    def save_user_profile(sender, instance, **kwargs):
        instance.student.save()


class Course(models.Model):
    name = models.CharField(max_length=100)
    students = models.ManyToManyField(User)

    def __str__(self):
        return self.name


class Question(models.Model):
    question_text = models.CharField(max_length=200)
    course = models.ForeignKey(Course, on_delete=models.CASCADE, null=True, blank=True)
    times_answered = models.IntegerField(default=0)
    times_correct = models.IntegerField(default=0)

    def __str__(self):
        return self.question_text

    @admin.display(
        ordering='times_answered',
        description='Percent correct by number of questions answered'
    )
    def percent_correct(self):
        if self.times_answered > 0:
            return (self.times_correct / self.times_answered) * 100
        else:
            return 0


class Answer(models.Model):
    answer_text = models.CharField(max_length=200)
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    correct = models.BooleanField(default=False)

    def __str__(self):
        return self.answer_text


class Tile(models.Model):
    path = models.CharField(max_length=200)

    def __str__(self):
        return self.path


class QuestionSet(models.Model):
    name = models.CharField(max_length=200)
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    questions = models.ManyToManyField(Question)

    @admin.display(
        description='Set of questions to be answered in a level'
    )
    def __str__(self):
        return self.name


@receiver(post_save, sender=Question)
def add_to_main_question_set(sender, instance, created, **kwargs):
    if created:
        main_question_set, _ = QuestionSet.objects.get_or_create(name='Main')
        main_question_set.questions.add(instance)
        main_question_set.save()

