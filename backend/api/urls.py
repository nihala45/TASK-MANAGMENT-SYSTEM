from django.urls import path,include
from .views import RegisterView, LoginView, UserDetailView,SuperAdminLoginView, UserViewSet, CreateAdminView,CreateTaskView,AllTasksView, task_detail,AssignTaskToAdminView,AdminLoginView, get_csrf_token

from rest_framework.routers import DefaultRouter


router = DefaultRouter()
router.register(r'admin/userslist', UserViewSet, basename='user')


urlpatterns = [
    path('get-csrf/', get_csrf_token, name='get_csrf'),
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('user/', UserDetailView.as_view(), name='user-details'),
    path('admin/superlogin/', SuperAdminLoginView.as_view(), name='admin-login'),
    path('create-admin/', CreateAdminView.as_view(), name='create-admin'),
    path('tasks/create/', CreateTaskView.as_view(), name='create-task'), 
    path('admin/tasks/', AllTasksView.as_view(), name='all-tasks'),
    path('tasks/<int:pk>/', task_detail, name='task-detail'),
    path('assign-task-to-admin/', AssignTaskToAdminView.as_view(), name='assign-task-to-admin'),
    path('admin/loginn/', AdminLoginView.as_view(), name='admin-loginn'),
    path('', include(router.urls)),
]