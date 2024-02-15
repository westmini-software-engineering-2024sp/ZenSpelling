from ZenSpelling.models import User, Question, Answer, Course
import csv


def answer_import():
    with open("./ZenSpelling/static/ZenSpelling/csv/answer.csv") as file:
        for row in csv.reader(file):
            _, created = Answer.objects.get_or_create(
                answer_text=row[0],
                question=Question.objects.get(id=row[1]),
            )
            print(created)


def course_import():
    with open("./ZenSpelling/static/ZenSpelling/csv/course.csv") as file:
        for row in csv.reader(file):
            result, created = Course.objects.get_or_create(
                name=row[0],
            )
            result.students.add(row[1])
            print(created)


def user_import():
    with open("./ZenSpelling/static/ZenSpelling/csv/user.csv") as file:
        for row in csv.reader(file):
            _, created = User.objects.get_or_create(
                username=row[0],
                password=row[1],
                time_spent=row[2],
                questions_answered=row[3],
                questions_correct=row[4],
            )
            print(created)


def question_import():
    with open("./ZenSpelling/static/ZenSpelling/csv/question.csv") as file:
        for row in csv.reader(file):
            _, created = Question.objects.get_or_create(
                question_text=row[0],
                course=Course.objects.get(id=row[1]),
                correct_answer=row[2],
                times_answered=row[3],
                times_correct=row[4],
            )
            print(created)


def run():
    user_import()
    course_import()
    question_import()
    answer_import()

    print("Done")
