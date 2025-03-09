@extends('layouts.app')

@section('content')
<h1>Chỉnh Sửa User</h1>
<form action="{{ route('users.update', $user->id) }}" method="POST">
    @csrf
    @method('PUT')
    <div class="form-group">
        <label for="name">Tên:</label>
        <input type="text" name="name" class="form-control" value="{{ $user->name }}" required>
    </div>
    <div class="form-group">
        <label for="email">Email:</label>
        <input type="email" name="email" class="form-control" value="{{ $user->email }}" required>
    </div>
    <!-- Bạn có thể thêm phần chỉnh sửa Role nếu cần -->
    <button type="submit" class="btn btn-primary">Cập nhật User</button>
</form>
@endsection
