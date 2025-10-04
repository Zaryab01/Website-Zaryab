from django.conf import settings
from django.contrib import messages
from django.core.mail import BadHeaderError, send_mail
from django.shortcuts import redirect, render


def home(request):
    return render(request, "index.html")


def about(request):
    achievements = [
        {
            "year": "2024",
            "title": "Cybersecurity Specialist",
            "description": (
                "Led enterprise security audits and implemented AI-driven monitoring "
                "to reduce incident response time by 40%."
            ),
        },
        {
            "year": "2023",
            "title": "AI Research Collaborator",
            "description": (
                "Co-authored research on anomaly detection for smart infrastructure "
                "and deployed prototypes in production."
            ),
        },
        {
            "year": "2022",
            "title": "Full-Stack Innovator",
            "description": (
                "Architected immersive web experiences with real-time data "
                "visualisations for high-impact clients."
            ),
        },
    ]

    skills = [
        {"name": "Machine Learning", "level": 92},
        {"name": "Cybersecurity Strategy", "level": 88},
        {"name": "Full-Stack Development", "level": 90},
        {"name": "Cloud & DevOps", "level": 84},
    ]

    principles = [
        {
            "title": "Curiosity First",
            "icon": "fa-microscope",
            "copy": (
                "Every challenge is a system to explore. Curiosity fuels my experiments "
                "and unlocks elegant solutions."
            ),
        },
        {
            "title": "Security by Design",
            "icon": "fa-shield-alt",
            "copy": (
                "I embed secure patterns from the first commit, aligning usability with "
                "uncompromising protection."
            ),
        },
        {
            "title": "Human-Centred Tech",
            "icon": "fa-heartbeat",
            "copy": (
                "Technology succeeds when it feels intuitive. I craft experiences that "
                "make complex systems feel effortless."
            ),
        },
    ]

    context = {
        "achievements": achievements,
        "skills": skills,
        "principles": principles,
    }
    return render(request, "about.html", context)


def contact(request):
    contact_channels = [
        {
            "label": "Email",
            "value": "zaryab262@gmail.com",
            "icon": "fas fa-envelope",
            "href": "mailto:zaryab262@gmail.com",
        },
        {
            "label": "LinkedIn",
            "value": "linkedin.com/in/zaryab",
            "icon": "fab fa-linkedin-in",
            "href": "https://www.linkedin.com/in/zaryab",
        },
        {
            "label": "GitHub",
            "value": "github.com/zaryab-labs",
            "icon": "fab fa-github",
            "href": "https://github.com/zaryab-labs",
        },
    ]

    if request.method == "POST":
        name = request.POST.get("name", "").strip()
        email = request.POST.get("email", "").strip()
        subject = request.POST.get("subject", "").strip()
        message = request.POST.get("message", "").strip()

        if not all([name, email, subject, message]):
            messages.error(request, "Please complete all fields before sending your message.")
            return redirect("contact")

        composed_subject = f"Portfolio Message: {subject}"
        composed_body = (
            f"You have received a new message from {name} <{email}> via the portfolio contact form.\n\n"
            f"Message:\n{message}"
        )

        try:
            send_mail(
                composed_subject,
                composed_body,
                settings.DEFAULT_FROM_EMAIL,
                ["zaryab262@gmail.com"],
                fail_silently=False,
            )
        except BadHeaderError:
            messages.error(request, "Invalid header detected. Please try again.")
            return redirect("contact")
        except Exception:
            messages.error(
                request,
                "We couldn't send your message right now. Please try again later or reach out directly via email.",
            )
            return redirect("contact")

        messages.success(request, "Thanks for reaching out! Your message is on its way to my inbox.")
        return redirect("contact")

    return render(request, "contact.html", {"contact_channels": contact_channels})


def machine_learning(request):
    return render(request, "machine_learning.html")


def web_applications(request):
    return render(request, "web_applications.html")


def anomaly_ids(request):
    return render(request, "anomaly_ids.html")


def cybersecurity(request):
    return render(request, "cybersecurity.html")
