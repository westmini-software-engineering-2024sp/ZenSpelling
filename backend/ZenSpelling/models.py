from django.db import models
from django.contrib import admin


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
        if self.questions_answered > 0:
            return (self.questions_correct / self.questions_answered) * 100
        else: return 0


class Course(models.Model):
    name = models.CharField(max_length=100)
    students = models.ManyToManyField(User)


class Question(models.Model):
    question_text = models.CharField(max_length=200)
    course = models.ForeignKey(Course, on_delete=models.CASCADE, null=True, blank=True)
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
        if self.times_answered > 0:
            return (self.times_correct / self.times_answered) * 100
        else: return 0


class Answer(models.Model):
    answer_text = models.CharField(max_length=200)
    question = models.ForeignKey(Question, on_delete=models.CASCADE)

    def __str__(self):
        return self.answer_text


