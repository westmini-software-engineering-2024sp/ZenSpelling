from ZenSpelling.models import User, Question, Answer, Course
import csv


def answer_import():
    with open("static/ZenSpelling/csv/answer.csv") as file:
        for row in csv.reader(file):
            _, created = Answer.objects.get_or_create(
                answer_text=row[0],
                question=row[1],
            )
            print(created)


def course_import():
    with open("static/ZenSpelling/csv/course.csv") as file:
        for row in csv.reader(file):
            _, created = Course.objects.get_or_create(
                name=row[0],
                students=row[1],
            )
            print(created)


def user_import():
    with open("static/ZenSpelling/csv/user.csv") as file:
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
    with open("static/ZenSpelling/csv/question.csv") as file:
        for row in csv.reader(file):
            _, created = Question.objects.get_or_create(
                question_text=row[0],
                course=row[1],
                correct_answer=row[2],
                times_answered=row[3],
                times_correct=row[4],
            )
            print(created)


if __name__ == "__main__":
    #answer_import()
    #course_import()
    user_import()
    #question_import()
    print("Done")
