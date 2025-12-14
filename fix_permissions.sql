-- Supabase SQL Editorで実行してください

-- 1. listingsテーブルのRLSを有効化（既に有効な場合は不要）
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;

-- 2. "自分の物件のみ更新できる" ポリシーを作成
CREATE POLICY "Users can update their own listings"
ON listings
FOR UPDATE
USING (auth.uid() = host_id);

-- 3. "自分の物件のみ削除できる" ポリシーを作成（削除も同様に失敗する場合）
CREATE POLICY "Users can delete their own listings"
ON listings
FOR DELETE
USING (auth.uid() = host_id);
