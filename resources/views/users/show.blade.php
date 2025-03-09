@extends('layouts.app')

@section('content')
<h1>Thông Tin User</h1>
<div class="card">
    <div class="card-body">
        <h5 class="card-title">{{ $user->name }}</h5>
        <p class="card-text"><strong>Email:</strong> {{ $user->email }}</p>
        <p class="card-text"><strong>Vai trò:</strong>
            @if ($user->roles->isNotEmpty())
                @foreach ($user->roles as $role)
                    <span class="badge badge-info">{{ $role->name }}</span>
                @endforeach
            @else
                <span class="badge badge-secondary">No Role</span>
            @endif
        </p>
        <a href="{{ route('users.edit', $user->id) }}" class="btn btn-warning">Sửa</a>
        <a href="{{ route('users.index') }}" class="btn btn-secondary">Quay lại</a>
    </div>
</div>
@endsection
