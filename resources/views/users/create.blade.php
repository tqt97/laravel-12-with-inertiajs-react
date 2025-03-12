@extends('layouts.app')

@section('content')
<h1>Tạo User Mới</h1>
<form action="{{ route('users.store') }}" method="POST">
    @csrf
    <div class="form-group">
        <label for="name">Tên:</label>
        <input type="text" name="name" class="form-control" placeholder="Nhập tên user" required>
    </div>
    <div class="form-group">
        <label for="email">Email:</label>
        <input type="email" name="email" class="form-control" placeholder="Nhập email" required>
    </div>
    <div class="form-group">
        <label for="password">Mật khẩu:</label>
        <input type="password" name="password" class="form-control" placeholder="Nhập mật khẩu" required>
    </div>
    <div class="form-group">
        <label for="password_confirmation">Xác nhận mật khẩu:</label>
        <input type="password" name="password_confirmation" class="form-control" placeholder="Xác nhận mật khẩu" required>
    </div>
    <!-- Nếu cần, bạn có thể thêm phần chọn Role cho user -->
    <button type="submit" class="btn btn-success">Tạo User</button>
</form>
@endsection
