-- This is a verification script to check Redis functionality
-- Note: This is a conceptual representation since Redis uses key-value operations

-- Verify the creations sorted set exists
-- Redis command: ZCARD creations
SELECT 'Checking creations index...' as operation;

-- Check for any existing creation keys
-- Redis command: KEYS creation:*
SELECT 'Checking existing creations...' as operation;

-- The actual Redis operations in the app include:
-- 1. ZADD creations {score: timestamp, member: id} - Add creation to sorted list
-- 2. SET creation:{id} {JSON data} - Store creation data
-- 3. ZRANGE creations 0 -1 REV - Get creations sorted by newest first
-- 4. GET creation:{id} - Retrieve specific creation
-- 5. DEL creation:{id} - Delete creation
-- 6. ZREM creations {id} - Remove from sorted list
