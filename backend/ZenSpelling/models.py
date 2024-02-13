from django.db import models
from django.contrib import admin


class Question(models.Model):
    question_text = models.CharField(max_length=100)
    course = models.CharField(max_length=100)
    correct_answer = models.IntegerField(default=0)
    times_answered = models.IntegerField(default=0)
    times_correct = models.IntegerField(default=0)

    def __str__(self):
        return self.question_text

    @admin.display(
        ordering='times_answered',
        description='Percent correct by number of questions answered'
    )
    def percent_correct(self):
        return (self.times_correct / self.times_answered) * 100


class Answer(models.Model):
    answer_text = models.CharField(max_length=200)
    question = models.ForeignKey(Question, on_delete=models.CASCADE)

    def __str__(self):
        return self.answer_text


class User(models.Model):
    username = models.CharField(max_length=40, unique=True)
    password = models.CharField(max_length=256)  # to be hashed before saving
    time_spent = models.DecimalField(max_digits=5, decimal_places=2)  # minutes
    questions_answered = models.IntegerField(default=0)
    questions_correct = models.IntegerField(default=0)

    def __str__(self):
        return self.username

    @admin.display(
        ordering='questions_answered',
        description='Percent correct by number of questions',
    )
    def percent_correct_lifetime(self):
        return (self.questions_correct / self.questions_answered) * 100
