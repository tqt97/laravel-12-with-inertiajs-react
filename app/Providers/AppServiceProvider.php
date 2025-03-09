<?php

namespace App\Providers;

use App\Repositories\Permission\CachedPermissionRepository;
use App\Repositories\Permission\PermissionRepository;
use App\Repositories\Permission\PermissionRepositoryInterface;
use App\Services\CacheService;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->singleton(CacheService::class);

        // if have more repositories, should be registered here
        // $this->app->singleton(PermissionRepository::class, function ($app) {
        //     return new PermissionRepository($app->make(Permission::class));
        // });

        // use bind because repository need different data when use cache
        $this->app->bind(PermissionRepositoryInterface::class, function ($app) {
            $permissionRepository = $app->make(PermissionRepository::class);
            $cacheService = $app->make(CacheService::class);

            return config('repository.use_cache')
                ? new CachedPermissionRepository($permissionRepository, $cacheService)
                : $permissionRepository;
        });
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Model::shouldBeStrict(! $this->app->environment('production'));

        // Registering Policies
        // Gate::policy(User::class, UserPolicy::class);

    }
}
