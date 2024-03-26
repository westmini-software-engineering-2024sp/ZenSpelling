from ZenSpelling.models import Question, Answer, Course, Student, Tile
from django.contrib.auth.models import User
from django.contrib.auth.hashers import PBKDF2SHA1PasswordHasher as hasher
import csv



# repetitive code added with assistance from copilot.


def answer_import():
    with open("./ZenSpelling/static/ZenSpelling/csv/answer.csv", mode='r', encoding='utf-8-sig') as file:
        for row in csv.reader(file):
            _, created = Answer.objects.get_or_create(
                answer_text=row[0],
                question=Question.objects.get(id=row[1]),
                correct=row[2],
            )
            print(created)


def course_import():
    with open("./ZenSpelling/static/ZenSpelling/csv/course.csv", mode='r', encoding='utf-8-sig') as file:
        for row in csv.reader(file):
            result, created = Course.objects.get_or_create(
                name=row[0],
            )
            result.students.add(row[1])
            print(created)


def user_import():
    with open("./ZenSpelling/static/ZenSpelling/csv/user.csv", mode='r', encoding='utf-8-sig') as file:
        for row in csv.reader(file):
            result, created = User.objects.get_or_create(
                username=row[0],
                password=hasher.encode(hasher(), row[1], hasher.salt(hasher())),
                is_staff=row[5],
            )
            print(created)


def question_import():
    with open("./ZenSpelling/static/ZenSpelling/csv/question.csv", mode='r', encoding='utf-8-sig') as file:
        for row in csv.reader(file):
            _, created = Question.objects.get_or_create(
                question_text=row[0],
                course=Course.objects.get(id=row[1]),
                times_answered=row[2],
                times_correct=row[3],
            )
            print(created)


def tile_import():
    with open("./ZenSpelling/static/ZenSpelling/csv/tile.csv", mode='r', encoding='utf-8-sig') as file:
        for row in csv.reader(file):
            _, created = Tile.objects.get_or_create(
                path=row[0],
            )
            print(created)


def run():
    user_import()
    course_import()
    question_import()
    answer_import()
    tile_import()

    print("Done")
