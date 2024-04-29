from django.db import models
from django.contrib import admin
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from django.db.models.signals import post_save
from django.dispatch import receiver


# class Garden(models.Model):
#     path = models.CharField(max_length=200)  # TODO save the images with a name and date and store it here
#     garden = models.ImageField(upload_to='ZenSpelling/static/ZenSpelling/images/gardens/')
#
#     def get_image(self):
#         return self.path
#
#     def __str__(self):
#         return self.path[46:]


class Student(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    time_spent = models.DecimalField(max_digits=16, decimal_places=0, default=0)
    questions_answered = models.IntegerField(default=0)
    questions_correct = models.IntegerField(default=0)
    games_completed = models.IntegerField(default=0)
    streak = models.IntegerField(default=0)
    min_time = models.IntegerField(default=500)
    time_medal = models.IntegerField(default=0)
    percent_medal = models.IntegerField(default=0)
    streak_medal = models.IntegerField(default=0)
    time_medal_earned = models.BooleanField(default=False)
    percent_medal_earned = models.BooleanField(default=False)
    streak_medal_earned = models.BooleanField(default=False)

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


class Garden(models.Model):
    garden = models.BinaryField()
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='gardens')

    def get_image(self):
        return self.garden


class Course(models.Model):
    name = models.CharField(max_length=100)
    students = models.ManyToManyField(User)

    def __str__(self):
        return self.name


class Question(models.Model):
    question_text = models.CharField(max_length=500)
    course = models.ForeignKey(Course, on_delete=models.CASCADE, null=True, blank=True)
    times_answered = models.IntegerField(default=0)
    times_correct = models.IntegerField(default=0)
    hint = models.TextField(null=False, blank=False)

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
            return "Not yet answered"


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

    """
    @receiver(post_save, sender=Question)
    def add_to_main_question_set(sender, instance, created, **kwargs):
        if created:
            main_question_set, _ = QuestionSet.objects.get_or_create(name='Main')
            main_question_set.questions.add(instance)
            main_question_set.save()
            """


class StudentAnalytics(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    times_answered = models.IntegerField(default=0)
    times_correct = models.IntegerField(default=0)
    hint = models.BooleanField(default=False)

    def __str__(self):
        return self.user.username + " | " + self.question.question_text

    def get_most_incorrect(self):
        pass
        # TODO queryset/filter i think

    def percent_correct(self):
        return self.times_correct / self.times_answered * 100
