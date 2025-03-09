<?php

declare(strict_types=1);

namespace App\Repositories;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Log;

abstract class BaseRepository implements BaseRepositoryInterface
{
    public function __construct(protected Model $model) {}

    public function getAll(): Collection
    {
        return $this->model->all();
    }

    public function getAllWithColumns(array $columns = ['*']): Collection
    {
        return $this->model->select($columns)->get();
    }

    public function create(array $data): Model
    {
        return $this->model->create($data);
    }

    public function update(Model $model, array $data): bool
    {
        $model->fill($data);

        if ($model->isClean()) {
            Log::info('No changes detected, skipping update.');

            return true;
        }

        // use save to update the model and get full update event
        return $model->save();
    }

    public function delete(Model $model): bool
    {
        return $model->delete();
    }
}
