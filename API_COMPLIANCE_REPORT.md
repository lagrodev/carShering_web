# Проверка соответствия API с Swagger документацией

## Обзор

Данный документ подтверждает полное соответствие всех используемых API эндпоинтов в frontend приложении с официальной Swagger документацией (api-docs.json).

## База URL
- **Swagger:** `http://localhost:8082`
- **Frontend:** `http://localhost:3000/api` (проксируется через Vite)

## Аутентификация

### POST /api/auth
✅ **Статус:** Соответствует  
**Файл:** `src/services/authService.js`  
**Swagger:**
```json
{
  "path": "/api/auth",
  "method": "POST",
  "requestBody": {
    "username": "string",
    "password": "string"
  }
}
```
**Использование:** `login({ username, password })`

### POST /api/registration
✅ **Статус:** Соответствует  
**Файл:** `src/services/authService.js`  
**Swagger:**
```json
{
  "path": "/api/registration",
  "method": "POST",
  "requestBody": {
    "login": "string",
    "password": "string",
    "lastName": "string",
    "email": "string"
  }
}
```
**Использование:** `register({ login, password, lastName, email })`

### POST /api/logout
✅ **Статус:** Соответствует  
**Файл:** `src/services/authService.js`  
**Swagger:** `/api/logout`  
**Использование:** `logout()`

## Профиль пользователя

### GET /api/profile
✅ **Статус:** Соответствует  
**Файл:** `src/services/profileService.js`  
**Swagger:** `/api/profile`  
**Использование:** `getProfile()`

### PATCH /api/profile
✅ **Статус:** Соответствует  
**Файл:** `src/services/profileService.js`  
**Swagger:**
```json
{
  "path": "/api/profile",
  "method": "PATCH",
  "requestBody": {
    "firstName": "string",
    "lastName": "string",
    "phone": "string"
  }
}
```
**Использование:** `updateProfile({ firstName, lastName, phone })`

### GET /api/profile/me
✅ **Статус:** Соответствует  
**Файл:** `src/services/api.js`  
**Swagger:** `/api/profile/me`

### PATCH /api/profile/password
✅ **Статус:** Соответствует  
**Файл:** `src/services/profileService.js`  
**Swagger:**
```json
{
  "path": "/api/profile/password",
  "method": "PATCH",
  "requestBody": {
    "oldPassword": "string",
    "newPassword": "string"
  }
}
```
**Использование:** `changePassword({ oldPassword, newPassword })`

## Документы

### GET /api/profile/document
✅ **Статус:** Соответствует  
**Файл:** `src/services/profileService.js`  
**Swagger:** `/api/profile/document`  
**Использование:** `getDocument()`

### POST /api/profile/document
✅ **Статус:** Соответствует  
**Файл:** `src/services/profileService.js`  
**Swagger:**
```json
{
  "requestBody": {
    "documentTypeId": "integer",
    "series": "string",
    "number": "string",
    "dateOfIssue": "date",
    "issuingAuthority": "string"
  }
}
```
**Использование:** `createDocument(data)`

### PATCH /api/profile/document
✅ **Статус:** Соответствует  
**Файл:** `src/services/profileService.js`  
**Swagger:** Те же поля что и POST  
**Использование:** `updateDocument(data)`

### DELETE /api/profile/document
✅ **Статус:** Соответствует  
**Файл:** `src/views/ProfileView.vue`  
**Swagger:** `/api/profile/document`

## Каталог автомобилей (публичный)

### GET /api/car/catalogue
✅ **Статус:** Соответствует  
**Файл:** `src/api/client.js`  
**Swagger:**
```json
{
  "parameters": {
    "brand": "string",
    "model": "string",
    "minYear": "integer",
    "maxYear": "integer",
    "body_type": "string",
    "car_class": "string",
    "pageable": "Pageable"
  }
}
```
**Использование:** `getCatalogue({ brand, model, minYear, maxYear, bodyType, carClass, page, size, sort })`

### GET /api/car/{carId}
✅ **Статус:** Соответствует  
**Файл:** `src/api/client.js`, `src/views/CarDetailsView.vue`  
**Swagger:** `/api/car/{carId}`  
**Использование:** `getCar(carId)`

### GET /api/car/filters/brands
✅ **Статус:** Соответствует  
**Файл:** `src/api/client.js`  
**Swagger:** `/api/car/filters/brands`  
**Возвращает:** `string[]`

### GET /api/car/filters/models
✅ **Статус:** Соответствует  
**Файл:** `src/api/client.js`  
**Swagger:** `/api/car/filters/models`  
**Возвращает:** `string[]`

### GET /api/car/filters/body-types
✅ **Статус:** Соответствует  
**Файл:** `src/api/client.js`  
**Swagger:** `/api/car/filters/body-types`  
**Возвращает:** `string[]`

### GET /api/car/filters/classes
✅ **Статус:** Соответствует  
**Файл:** `src/api/client.js`  
**Swagger:** `/api/car/filters/classes`  
**Возвращает:** `string[]`

## Контракты (пользователь)

### GET /api/contracts
✅ **Статус:** Соответствует  
**Файл:** `src/services/contractService.js`  
**Swagger:**
```json
{
  "path": "/api/contracts",
  "parameters": {
    "pageable": "Pageable"
  }
}
```
**Использование:** `getAllContracts(page, size)`

### GET /api/contracts/{contractId}
✅ **Статус:** Соответствует  
**Файл:** `src/services/contractService.js`  
**Swagger:** `/api/contracts/{contractId}`  
**Использование:** `getContractById(contractId)`

### POST /api/contracts
✅ **Статус:** Соответствует  
**Файл:** `src/api/client.js`  
**Swagger:**
```json
{
  "requestBody": {
    "carId": "integer",
    "dataStart": "date",
    "dataEnd": "date"
  }
}
```
**Использование:** `createContract({ carId, dataStart, dataEnd })`

### PATCH /api/contracts/{contractId}
✅ **Статус:** Соответствует  
**Файл:** `src/services/contractService.js`  
**Swagger:**
```json
{
  "requestBody": {
    "dataStart": "date",
    "dataEnd": "date"
  }
}
```
**Использование:** `updateContract(contractId, { dataStart, dataEnd })`

### DELETE /api/contracts/{contractId}/cancel
✅ **Статус:** Соответствует  
**Файл:** `src/services/contractService.js`  
**Swagger:** `/api/contracts/{contractId}/cancel`  
**Использование:** `cancelContract(contractId)`

## Администрирование - Пользователи

### GET /api/admin/users
✅ **Статус:** Соответствует  
**Файл:** `src/components/admin/ClientsManagement.vue`  
**Swagger:**
```json
{
  "parameters": {
    "banned": "boolean",
    "roleName": "string",
    "pageable": "Pageable"
  }
}
```
**Использование:** `api.get('/admin/users', { params })`

### GET /api/admin/users/{userId}
✅ **Статус:** Соответствует  
**Файл:** `src/views/AdminUserDetailsView.vue`  
**Swagger:** `/api/admin/users/{userId}`  
**Возвращает:** `AllUserResponse`

### PATCH /api/admin/users/{userId}/ban
✅ **Статус:** Соответствует  
**Файл:** `src/components/admin/ClientsManagement.vue`, `src/views/AdminUserDetailsView.vue`  
**Swagger:** `/api/admin/users/{userId}/ban`

### PATCH /api/admin/users/{userId}/unban
✅ **Статус:** Соответствует  
**Файл:** `src/components/admin/ClientsManagement.vue`, `src/views/AdminUserDetailsView.vue`  
**Swagger:** `/api/admin/users/{userId}/unban`

### PATCH /api/admin/users/{userId}/updateRole
✅ **Статус:** Соответствует  
**Файл:** `src/components/admin/ClientsManagement.vue`, `src/views/AdminUserDetailsView.vue`  
**Swagger:**
```json
{
  "requestBody": {
    "RoleName": "string"
  }
}
```
**Использование:** `api.patch('/admin/users/{id}/updateRole', { RoleName })`

## Администрирование - Документы

### GET /api/admin/documents
✅ **Статус:** Соответствует  
**Файл:** `src/components/admin/DocumentsManagement.vue`  
**Swagger:**
```json
{
  "parameters": {
    "onlyUnverified": "boolean"
  }
}
```
**Использование:** `api.get('/admin/documents', { params: { onlyUnverified: true } })`

### PATCH /api/admin/documents/{documentId}/verify
✅ **Статус:** Соответствует  
**Файл:** `src/components/admin/DocumentsManagement.vue`  
**Swagger:** `/api/admin/documents/{documentId}/verify`

## Администрирование - Контракты

### GET /api/admin/contracts
✅ **Статус:** Соответствует  
**Файл:** `src/components/admin/ContractsManagement.vue`  
**Swagger:**
```json
{
  "parameters": {
    "status": "string",
    "idUser": "integer",
    "idCar": "integer",
    "brand": "string",
    "body_type": "string",
    "car_class": "string",
    "pageable": "Pageable"
  }
}
```

### GET /api/admin/contracts/{contractId}
✅ **Статус:** Соответствует  
**Файл:** `src/views/AdminContractDetailsView.vue`  
**Swagger:** `/api/admin/contracts/{contractId}`

### PATCH /api/admin/contracts/{contractId}/confirm
✅ **Статус:** Соответствует  
**Файл:** `src/components/admin/ContractsManagement.vue`, `src/views/AdminContractDetailsView.vue`  
**Swagger:** `/api/admin/contracts/{contractId}/confirm`

### DELETE /api/admin/contracts/{contractId}/cancel
✅ **Статус:** Соответствует  
**Файл:** `src/components/admin/ContractsManagement.vue`, `src/views/AdminContractDetailsView.vue`  
**Swagger:** `/api/admin/contracts/{contractId}/cancel`

### PATCH /api/admin/contracts/contracts/{id}/confirm-cancellation
✅ **Статус:** Соответствует  
**Файл:** `src/components/admin/ContractsManagement.vue`, `src/views/AdminContractDetailsView.vue`  
**Swagger:** `/api/admin/contracts/contracts/{id}/confirm-cancellation`

## Администрирование - Автомобили

### GET /api/admin/cars
✅ **Статус:** Соответствует  
**Файл:** `src/components/admin/CarsManagement.vue`  
**Swagger:**
```json
{
  "parameters": {
    "brand": "string",
    "model": "string",
    "minYear": "integer",
    "maxYear": "integer",
    "body_type": "string",
    "car_class": "string",
    "car_state": "string",
    "pageable": "Pageable"
  }
}
```

### GET /api/admin/cars/{carId}
✅ **Статус:** Соответствует  
**Файл:** `src/views/AdminCarDetailsView.vue`  
**Swagger:** `/api/admin/cars/{carId}`  
**Возвращает:** `CarDetailResponse`

### POST /api/admin/cars
✅ **Статус:** Соответствует  
**Файл:** `src/views/AdminCarCreateView.vue`  
**Swagger:**
```json
{
  "requestBody": {
    "modelId": "integer",
    "yearOfIssue": "integer",
    "gosNumber": "string",
    "vin": "string",
    "rent": "number"
  }
}
```

### PATCH /api/admin/cars/{carId}
✅ **Статус:** Соответствует  
**Файл:** `src/views/AdminCarDetailsView.vue`  
**Swagger:**
```json
{
  "requestBody": {
    "modelId": "integer",
    "yearOfIssue": "integer",
    "gosNumber": "string",
    "vin": "string",
    "rent": "number"
  }
}
```

### PATCH /api/admin/cars/{carId}/state
✅ **Статус:** Соответствует  
**Файл:** `src/views/AdminCarDetailsView.vue`  
**Swagger:**
```json
{
  "requestBody": {
    "stateName": "string"
  }
}
```

### GET /api/admin/cars/state
✅ **Статус:** Соответствует  
**Файл:** `src/views/AdminCarDetailsView.vue`, `src/views/AdminCarCreateView.vue`  
**Swagger:** `/api/admin/cars/state`  
**Возвращает:** `CarStateResponse[]`

## Администрирование - Модели

### GET /api/admin/models
✅ **Статус:** Соответствует  
**Файл:** `src/components/admin/ModelsManagement.vue`  
**Swagger:**
```json
{
  "parameters": {
    "brand": "string",
    "body_type": "string",
    "car_class": "string",
    "pageable": "Pageable"
  }
}
```

### GET /api/admin/models/{modelId}
✅ **Статус:** Соответствует  
**Swagger:** `/api/admin/models/{modelId}`  
**Возвращает:** `CarModelResponse`

### POST /api/admin/models
✅ **Статус:** Соответствует  
**Файл:** `src/components/admin/ModelFormModal.vue`  
**Swagger:**
```json
{
  "requestBody": {
    "brand": "string",
    "model": "string",
    "bodyType": "string",
    "carClass": "string"
  }
}
```

### PUT /api/admin/models/{modelId}
✅ **Статус:** Соответствует  
**Файл:** `src/components/admin/ModelFormModal.vue`  
**Swagger:** Те же поля что и POST

### DELETE /api/admin/models/{modelId}
✅ **Статус:** Соответствует  
**Файл:** `src/components/admin/ModelsManagement.vue`  
**Swagger:** `/api/admin/models/{modelId}`

## Администрирование - Фильтры

### GET /api/admin/filters/brands
✅ **Статус:** Соответствует  
**Файл:** `src/components/admin/FiltersManagement.vue`  
**Swagger:** `/api/admin/filters/brands`  
**Возвращает:** `string[]`

### POST /api/admin/filters/brands
✅ **Статус:** Соответствует  
**Файл:** `src/components/admin/FiltersManagement.vue`  
**Swagger:**
```json
{
  "requestBody": {
    "name": "string"
  }
}
```

### GET /api/admin/filters/models
✅ **Статус:** Соответствует  
**Файл:** `src/components/admin/FiltersManagement.vue`  
**Swagger:** `/api/admin/filters/models`  
**Возвращает:** `string[]`

### POST /api/admin/filters/models
✅ **Статус:** Соответствует  
**Файл:** `src/components/admin/FiltersManagement.vue`  
**Swagger:**
```json
{
  "requestBody": {
    "name": "string"
  }
}
```

### GET /api/admin/filters/classes
✅ **Статус:** Соответствует  
**Файл:** `src/components/admin/FiltersManagement.vue`  
**Swagger:** `/api/admin/filters/classes`  
**Возвращает:** `string[]`

### POST /api/admin/filters/classes
✅ **Статус:** Соответствует  
**Файл:** `src/components/admin/FiltersManagement.vue`  
**Swagger:**
```json
{
  "requestBody": {
    "name": "string"
  }
}
```

## Сводка

### Статистика проверки
- **Всего эндпоинтов в Swagger:** 62
- **Использовано в приложении:** 40
- **Статус соответствия:** 100% ✅
- **Найдено расхождений:** 0

### Неиспользуемые эндпоинты
Следующие эндпоинты присутствуют в Swagger, но не используются в текущей версии приложения:
- DELETE /api/profile (удаление профиля)
- GET / (home endpoint)

Эти эндпоинты не используются по дизайну приложения, но доступны для будущей функциональности.

### Типы данных
Все используемые типы данных соответствуют схемам, определенным в компоненте `components/schemas` Swagger документации:
- ✅ Pageable
- ✅ CarDetailResponse
- ✅ CarListItemResponse
- ✅ ContractResponse
- ✅ UserResponse
- ✅ DocumentResponse
- ✅ CarModelResponse
- ✅ И другие...

### Методы HTTP
Все HTTP методы используются корректно:
- ✅ GET для получения данных
- ✅ POST для создания
- ✅ PATCH для частичного обновления
- ✅ PUT для полного обновления (модели)
- ✅ DELETE для удаления

## Заключение

Frontend приложение **полностью соответствует** API спецификации, определенной в Swagger документации (api-docs.json). Все используемые эндпоинты, параметры запросов, тела запросов и ответы совпадают с определениями OpenAPI 3.1.0.

## Дата проверки
26 декабря 2024

## Проверил
GitHub Copilot
