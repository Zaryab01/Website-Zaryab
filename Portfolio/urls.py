from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('about/', views.about, name='about'),
    path('contact/', views.contact, name='contact'),

    # Machine Learning
    path('machine-learning/', views.machine_learning, name='machine_learning'),

    # Web Applications
    path('web-applications/', views.web_applications, name='web_applications'),

    # Anomaly-based IDS project
    path('anomaly-ids/', views.anomaly_ids, name='anomaly_ids'),

    # Cybersecurity
    path('cybersecurity/', views.cybersecurity, name='cybersecurity'),

    # Predict
    path('cybersecurity/', views.cybersecurity, name='predict_eeg'),
]
