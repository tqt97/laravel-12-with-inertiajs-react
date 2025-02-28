<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Symfony\Component\HttpFoundation\Response;

class CheckPolicyMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, string $policyMethod): Response
    {
        // Lấy tên Model từ Controller
        $controller = class_basename($request->route()->getController());
        $modelClass = 'App\\Models\\' . str_replace('Controller', '', $controller);

        // Kiểm tra Policy
        if (!Gate::allows($policyMethod, $modelClass)) {
            abort(Response::HTTP_FORBIDDEN, 'This action is unauthorized.');
        }
        return $next($request);
    }
}
