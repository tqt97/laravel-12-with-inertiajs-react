@extends('layouts.app')

@section('content')
    <h3>Danh Sách Users</h3>
    <br>
    @can('create', App\Models\User::class)
        <a href="{{ route('users.create') }}" class="btn btn-primary mb-3">+ Tạo User Mới</a>
    @endcan
    <table class="table table-bordered">
        <thead>
            <tr>
                <th>ID</th>
                <th>Tên</th>
                <th>Email</th>
                <th>Vai trò</th>
                <th>Hành động</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($users as $user)
                <tr>
                    <td>{{ $user->id }}</td>
                    <td>{{ $user->name }}</td>
                    <td>{{ $user->email }}</td>
                    <td>
                        @if ($user->roles->isNotEmpty())
                            @foreach ($user->roles as $role)
                                <span class="badge badge-info">{{ $role->name }}</span>
                            @endforeach
                        @else
                            <span class="badge badge-secondary">No Role</span>
                        @endif
                    </td>
                    <td>
                        @can('update', $user)
                            <a href="{{ route('users.edit', $user->id) }}" class="btn btn-warning btn-sm">Sửa</a>
                        @endcan

                        @can('view', $user)
                            <a href="{{ route('users.show', $user->id) }}" class="btn btn-info btn-sm">Xem</a>
                        @endcan

                        @can('delete', $user)
                            <form action="{{ route('users.destroy', $user->id) }}" method="POST" style="display: inline-block;">
                                @csrf
                                @method('DELETE')
                                <button class="btn btn-danger btn-sm"
                                    onclick="return confirm('Bạn có chắc chắn muốn xóa user này?');">Xóa</button>
                            </form>
                        @endcan
                    </td>
                </tr>
            @endforeach
        </tbody>
    </table>
@endsection
