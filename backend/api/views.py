from django.shortcuts import render
from rest_framework import generics, permissions, status, viewsets
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.decorators import api_view, action
from django.contrib.auth import authenticate
from .models import User
from .serializers import UserSerializer
from rest_framework.permissions import IsAdminUser
from django.contrib.auth.hashers import make_password
from .models import Task
from .serializers import TaskSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from .models import AdminAssignedToTask
from .serializers import AdminAssignedToTaskSerializer
from rest_framework.authentication import BasicAuthentication
from django.views.decorators.csrf import ensure_csrf_cookie

from django.http import JsonResponse
from rest_framework.permissions import AllowAny

from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator




@ensure_csrf_cookie
def get_csrf_token(request):
    return JsonResponse({'message': 'CSRF cookie set'})


@method_decorator(csrf_exempt, name='dispatch')
class AdminLoginView(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        from django.contrib.auth import get_user_model
        User = get_user_model()
        user = User.objects.filter(username=username).first()

        if user:
            print("Found user:", user.username)
            if user.check_password(password):
                print("Password matched")
                if user.role == 'admin':
                    print("Role matched")
                    refresh = RefreshToken.for_user(user)
                    return Response({
                        'refresh': str(refresh),
                        'access': str(refresh.access_token),
                        'username': user.username,
                        'email': user.email,
                        'role': user.role,
                    })
                else:
                    print("Not an admin:", user.role)
            else:
                print("Wrong password")
        else:
            print("User not found")

        return Response({'detail': 'Invalid credentials or not an admin'}, status=status.HTTP_401_UNAUTHORIZED)






class SuperAdminLoginView(APIView):
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(username=username, password=password)

        if user is not None and user.is_superuser:
            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'is_superuser': user.is_superuser
            })
        return Response({'detail': 'Invalid credentials or not an admin'}, status=status.HTTP_401_UNAUTHORIZED)
    
    

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny]

    def perform_create(self, serializer):
        print('Creating user with data:', self.request.data)
        serializer.save()


class LoginView(APIView):
    def post(self, request,*args, **kwargs):
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(request, username=username, password=password)
        print(username,password)
        print(user)
        if user is not None:
            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh' : str(refresh),
                'access' : str(refresh.access_token),
                'is_superuser': user.is_superuser,
                'user_id': user.id,
                 
            })
        return Response({'error' : "Invalid Credentials"}, status=400)
    
class UserDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]
    def get_object(self):
        print(self.request.user)
        return self.request.user
    

    
class UserViewSet(viewsets.ViewSet):
    permission_classes = [permissions.IsAdminUser]

    def list(self, request):
        users = User.objects.all()
        serializer = UserSerializer(users, many=True)
        print(request.data)
        return Response(serializer.data)

    def retrieve(self, request, pk=None):
        try:
            user = User.objects.get(pk=pk)
        except User.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        serializer = UserSerializer(user)
        return Response(serializer.data)

    def create(self, request):
        serializer = UserSerializer(data=request.data)
        print('admin create user data ', request.data)
        if serializer.is_valid():
            print('admin create user serializer is valid')
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, pk=None):
        try:    
            print(pk)
            user = User.objects.get(pk=pk)
        except User.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        
        serializer = UserSerializer(user, data=request.data, partial=True)
        print(serializer)
        if serializer.is_valid():
            print('serializers valid')
            serializer.save()
            return Response(serializer.data)
        print(serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, pk=None):
        try:
            user = User.objects.get(pk=pk)
        except User.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        user.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    @action(detail=True, methods=['post'])
    def block(self, request, pk=None):
        try:
            user = User.objects.get(pk=pk)
        except User.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        user.is_active = False
        user.save()
        return Response({'status': 'user blocked'}, status=status.HTTP_204_NO_CONTENT)

    @action(detail=True, methods=['post'])
    def unblock(self, request, pk=None):
        try:
            user = User.objects.get(pk=pk)
        except User.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        user.is_active = True
        user.save()
        return Response({'status': 'user unblocked'}, status=status.HTTP_204_NO_CONTENT)
    
    
class CreateAdminView(APIView):
    # permission_classes = [IsAdminUser]  

    def post(self, request):
        data = request.data.copy()
        required_fields = ['username', 'email', 'password', 'phone']

        for field in required_fields:
            if not data.get(field):
                return Response({'error': f'{field} is required'}, status=status.HTTP_400_BAD_REQUEST)

        if User.objects.filter(email=data['email']).exists():
            return Response({'error': 'Email already exists'}, status=status.HTTP_400_BAD_REQUEST)

        data['is_staff'] = True
        data['is_superuser'] = False 
        data['password'] = make_password(data['password'])
        data['role'] = 'admin'

        serializer = UserSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'Admin user created successfully', 'user': serializer.data}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    
   

    
    
class CreateTaskView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUser]

    def post(self, request):
        serializer = TaskSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'Task created successfully', 'task': serializer.data}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class AllTasksView(APIView):
    permission_classes = [IsAuthenticated] 

    def get(self, request):
        tasks = Task.objects.all().order_by('-id') 
        serializer = TaskSerializer(tasks, many=True)
        return Response(serializer.data)
    
    
@api_view(['GET', 'PUT', 'DELETE'])
def task_detail(request, pk):
    try:
        task = Task.objects.get(pk=pk)
    except Task.DoesNotExist:
        return Response({'error': 'Task not found'}, status=404)

    if request.method == 'GET':
        serializer = TaskSerializer(task)
        return Response(serializer.data)

    elif request.method == 'PUT':
        serializer = TaskSerializer(task, data=request.data, partial=True) 
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'Task updated successfully', 'task': serializer.data})
        return Response(serializer.errors, status=400)

    elif request.method == 'DELETE':
        task.delete()
        return Response({'message': 'Task deleted successfully'})

    
    

class AssignTaskToAdminView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUser]  

    def post(self, request):
        admin_id = request.data.get("admin_id")
        title = request.data.get("title")

        if not (admin_id and title):
            return Response({"error": "admin_id and title are required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            admin_user = User.objects.get(id=admin_id, role='admin')
        except User.DoesNotExist:
            return Response({"error": "Admin user not found or invalid role"}, status=status.HTTP_404_NOT_FOUND)

        task = AdminAssignedToTask.objects.create(title=title, assigned_to=admin_user)
        serializer = AdminAssignedToTaskSerializer(task)
        return Response({"message": "Task assigned successfully", "task": serializer.data}, status=status.HTTP_201_CREATED)
    
    

