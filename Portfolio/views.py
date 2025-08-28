from django.shortcuts import render, get_object_or_404

def home(request):
    return render(request, 'index.html')

def about(request):
    return render(request, 'about.html')

def contact(request):
    return render(request, 'contact.html')

# Machine Learning subcategories
def machine_learning(request):
    return render(request, 'machine_learning.html')

# Web Applications subcategories
def web_applications(request):
    return render(request, 'web_applications.html')

# Anomaly based IDS - single project
def anomaly_ids(request):
    return render(request, 'anomaly_ids.html')

# Cybersecurity subcategories
def cybersecurity(request):
    return render(request, 'cybersecurity.html')
