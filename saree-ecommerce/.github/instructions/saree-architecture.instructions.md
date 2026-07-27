---
description: >
  Architecture patterns, critical middleware exports, and pitfalls for the
  Saree eCommerce monorepo backend (apps/api). Auto-loaded for all TypeScript
  files under apps/api/src.
applyTo: 'apps/api/src/**/*.ts'
---

# Saree eCommerce — Backend Architecture Reference

## Project Layout

```
saree-ecommerce/          ← Turborepo / pnpm workspace root
  apps/
    api/                  ← Express + TypeScript backend
      src/
        controllers/      ← Factory functions: createXxxController(service)
        services/         ← Classes: export default class XxxService
        repositories/     ← Classes: export default class XxxRepository
        routes/           ← Express routers registered in src/routes/v1.ts
        middlewares/      ← authenticate (default), roleGuard (default), validate (default)
        validations/      ← express-validator rule arrays
        interfaces/       ← DTOs and response types (barrel: interfaces/index.ts)
        utils/            ← apiResponse, buildPagination, logger …
        prisma/           ← Generated Prisma client output
    admin/                ← Next.js 15 Admin dashboard
    web/                  ← Next.js 15 Customer website
  database/
    prisma/
      schema.prisma       ← Single schema; output → apps/api/src/prisma/
      migrations/         ← Named timestamped SQL files (manual Prisma migrations)
```

---

## Critical Middleware Exports

All three core middlewares use **default exports** — never named imports:

```typescript
// ✅ CORRECT
import authenticate from '../middlewares/authenticate';
import roleGuard    from '../middlewares/roleGuard';
import validate     from '../middlewares/validation.middleware';

// ❌ WRONG — causes TS2614 compile error
import { authenticate } from '../middlewares/authenticate';
import { validate }     from '../middlewares/validation.middleware';
```

---

## Route File Pattern

Every route file follows this exact structure:

```typescript
import { Router } from 'express';
import authenticate from '../middlewares/authenticate';
import roleGuard    from '../middlewares/roleGuard';
import validate     from '../middlewares/validation.middleware';
import XxxRepository   from '../repositories/xxx.repository';
import XxxService      from '../services/xxx.service';
import createXxxController from '../controllers/xxx.controller';
import { xxxRules } from '../validations/xxx.validation';

const router = Router();

// Instantiate DI chain at module load time
const repo    = new XxxRepository();
const service = new XxxService(repo);
const ctrl    = createXxxController(service);

router.get('/', authenticate, roleGuard(['Super Admin', 'Admin']), xxxRules, validate, ctrl.list);
// …

export default router;
```

Register new route files in `apps/api/src/routes/v1.ts`:

```typescript
import xxxRoutes from './xxx.routes';
router.use('/xxx', xxxRoutes);
```

---

## Layer Patterns

### Repository

```typescript
import prisma from '../prisma';

export default class XxxRepository {
  private db = prisma as any; // avoids strict Prisma type errors on dynamic access

  async findById(id: number) {
    return this.db.xxx.findUnique({ where: { id } });
  }

  // For complex SQL that Prisma ORM cannot express (column-to-column compare, etc.)
  async complexQuery() {
    return prisma.$queryRawUnsafe<Row[]>(`SELECT … FROM \`table\` WHERE …`);
  }
}
```

### Service

```typescript
export default class XxxService {
  constructor(private readonly repo: XxxRepository) {}
  // …
}
```

### Controller

```typescript
export default function createXxxController(service: XxxService) {
  return {
    list: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const data = await service.list();
        return apiResponse.success(res, data, 'Fetched successfully');
      } catch (e) { next(e); }
    },
  };
}
```

---

## MySQL Raw SQL Pitfalls

- **Reserved word tables** must be backtick-escaped: `` `order` ``, `` `product` ``
- **Join/pivot tables** use snake_case: `order_item`, `stock_movement`, `purchase_order`, `coupon_usage`
- **`COUNT()` / `SUM()` return BigInt** from `$queryRawUnsafe` — always wrap with `Number()` before returning
- **Column-to-column comparisons** (e.g. `availableStock <= reorderLevel`) cannot be expressed in Prisma ORM filters — use raw SQL
- **Date grouping format strings**:
  - Day: `DATE_FORMAT(createdAt, '%Y-%m-%d')`
  - Month: `DATE_FORMAT(createdAt, '%Y-%m')`
  - Week: `DATE_FORMAT(createdAt, '%Y-%u')`
  - Quarter: `DATE_FORMAT(createdAt, '%Y-Q%q')`

---

## Prisma Schema Location

- **Schema file**: `database/prisma/schema.prisma`
- **Generated client output**: `apps/api/src/prisma/`
- **Run generate after schema changes**:
  ```powershell
  cd C:\Projects\Eshop\saree-ecommerce\database
  $env:DATABASE_URL = "mysql://root:root@localhost:3306/saree_ecommerce"
  pnpm exec prisma generate
  pnpm exec prisma validate
  ```
- **Migration files** live in `database/prisma/migrations/<timestamp_name>/migration.sql`
  — use `CREATE INDEX IF NOT EXISTS` on existing tables to avoid errors on re-run

---

## TypeScript Compilation Check

After adding any new module, run from `apps/api/`:

```powershell
$env:DATABASE_URL = "mysql://root:root@localhost:3306/saree_ecommerce"
pnpm exec tsc --noEmit
```

Common errors to watch for:
- `TS2614` — named import from a default-export module (fix: remove `{ }`)
- `TS1117` — duplicate property in object literal (factory controller returned two handlers with the same key)

---

## Jest / Testing Configuration

`apps/api/jest.config.ts` **must exist** and set `preset: 'ts-jest'`:

```typescript
import type { Config } from 'jest';
const config: Config = { preset: 'ts-jest', testEnvironment: 'node', … };
export default config;
```

Without it, Jest falls back to Babel which cannot parse TypeScript generics like
`as jest.MockedClass<typeof SomeRepository>`, causing `SyntaxError` at test parse time.
`ts-jest` is already in devDependencies — only the config file is needed.

---

## apiResponse Utility

```typescript
apiResponse.success(res, data, 'message');           // 200
apiResponse.created(res, data, 'message');           // 201
apiResponse.noContent(res);                          // 204
apiResponse.badRequest(res, 'message');              // 400
apiResponse.unauthorized(res, 'message');            // 401
apiResponse.forbidden(res, 'message');               // 403
apiResponse.notFound(res, 'message');                // 404
apiResponse.conflict(res, 'message');                // 409
apiResponse.unprocessableEntity(res, 'message');     // 422
apiResponse.internalError(res, 'message');           // 500
```

For file download responses (export endpoints), bypass apiResponse and set headers directly:

```typescript
res.setHeader('Content-Type', mimeType);
res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
res.setHeader('Content-Length', buffer.length);
return res.end(buffer);
```

---

## buildPagination Return Shape

```typescript
buildPagination(page, pageSize, total)
// returns: { page, pageSize, total, totalPages, hasNext, hasPrev }
```

Spread into all paginated service method returns.

---

## RBAC Role Names (exact strings)

```
'Super Admin' | 'Admin' | 'Finance Manager' | 'Marketing Manager'
| 'Inventory Manager' | 'Content Manager' | 'Report Viewer' | 'Customer'
```

---

## Completed Modules (do not recreate)

| # | Module |
|---|--------|
| 01 | Backend Foundation & Auth (JWT + RBAC) |
| 02 | User Management |
| 03 | Master Data |
| 04 | Media Management (Cloudinary) |
| 05 | Product Management |
| 06 | Inventory & Warehouse |
| 07 | Customer & CRM |
| 08 | Shopping Cart & Checkout |
| 09 | Order Management |
| 10 | Payment & Billing |
| 11 | Marketing & Promotions |
| 12 | CMS, Content & SEO |
| 13 | Reports, Analytics & BI |

---

## Learnings

- **`authenticate` is a default export** — the old checkpoint 011 incorrectly listed it as a named export `{ authenticate }`. Always verify with `grep "^export" middlewares/authenticate.ts`.
- **Controller duplicate keys**: When a factory controller object grows large (500+ lines), TypeScript reports `TS1117` (duplicate property) at the *second* definition. The correct fix is to remove the second duplicate, not the first, as the first is usually in the semantically correct section. Run `Select-String -Pattern "handlerName" src/controllers/xxx.controller.ts` to find both line numbers before deciding which to remove.
- **Migration SQL on existing tables**: Use `CREATE INDEX IF NOT EXISTS` (MySQL 8.x) rather than `CREATE INDEX` when adding performance indexes to tables that already exist in production; this makes migration re-runnable without errors.
- **In-memory report cache**: The `ReportCache` class in `reports.service.ts` uses a `Map<string, {data, expiresAt}>`. Cache keys are built with `JSON.stringify(filter)`. TTL tiers: Dashboard=5min, Reports=15min, BI=30min. This is per-process; a Redis layer would be needed for multi-instance deployments.
