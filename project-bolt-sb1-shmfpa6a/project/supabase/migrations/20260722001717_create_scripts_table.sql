/*
# Create scripts table for Roblox scripts website

1. New Tables
- `scripts`
  - `id` (uuid, primary key)
  - `title` (text, not null) - name of the script
  - `description` (text, not null) - what the script does
  - `code` (text, not null) - the actual Lua script code
  - `author` (text, not null) - creator name
  - `game_name` (text, not null) - which Roblox game it's for
  - `hearts` (integer, default 0) - heart/like count
  - `tags` (text[], default '{}') - categorization tags
  - `created_at` (timestamptz, default now())
2. Security
- Enable RLS on `scripts`.
- Allow anon + authenticated CRUD because the data is intentionally shared/public (no-auth app).
3. Seed Data
- Inserts 12 sample Roblox scripts across various popular games.
*/

CREATE TABLE IF NOT EXISTS scripts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  code text NOT NULL,
  author text NOT NULL,
  game_name text NOT NULL,
  hearts integer NOT NULL DEFAULT 0,
  tags text[] NOT NULL DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE scripts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_scripts" ON scripts;
CREATE POLICY "anon_select_scripts" ON scripts FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_scripts" ON scripts;
CREATE POLICY "anon_insert_scripts" ON scripts FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_scripts" ON scripts;
CREATE POLICY "anon_update_scripts" ON scripts FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_scripts" ON scripts;
CREATE POLICY "anon_delete_scripts" ON scripts FOR DELETE
  TO anon, authenticated USING (true);

-- Seed data
INSERT INTO scripts (title, description, code, author, game_name, hearts, tags) VALUES
('Infinite Yield Admin', 'Full admin commands suite with over 100+ commands. Includes fly, noclip, speed, and more.', '-- Infinite Yield Admin Script\nloadstring(game:HttpGet("https://raw.githubusercontent.com/EdgeIY/infiniteyield/master/source"))()', 'EdgeIY', 'Universal', 15420, ARRAY['admin', 'commands', 'universal']),
('Arsenal Aimbot', 'Silent aimbot with smooth targeting and FOV circle visualization. Undetected and customizable.', '-- Arsenal Aimbot\nlocal player = game.Players.LocalPlayer\nlocal mouse = player:GetMouse()\n-- Configuration\nlocal fov = 100\nlocal smoothness = 0.1\n-- Aimbot logic here', 'ScriptHub', 'Arsenal', 8930, ARRAY['aimbot', 'fps', 'combat']),
('Blox Fruits Auto Farm', 'Auto farm levels, auto raid, auto quest with teleport features. Supports all seas.', '-- Blox Fruits Auto Farm\nloadstring(game:HttpGet("https://bloxfruits.example/autofarm.lua"))()\n-- Features: Auto Farm, Auto Raid, Teleport', 'FruitMaster', 'Blox Fruits', 23150, ARRAY['autofarm', 'adventure', 'rpg']),
('Pet Simulator 99 Auto Hatch', 'Automatically hatches eggs, fuses pets, and manages inventory. Includes auto-enchant.', '-- Pet Sim 99 Auto Hatch\nlocal eggs = {"Common Egg", "Rare Egg"}\nfor _, egg in ipairs(eggs) do\n  game:GetService("ReplicatedStorage").Hatch:FireServer(egg)\nend', 'PetLover', 'Pet Simulator 99', 12780, ARRAY['auto', 'simulation', 'pets']),
('Da Hood Aimlock', 'Locks aim onto nearest player with smooth camera transitions. Mobile and PC compatible.', '-- Da Hood Aimlock\nlocal lockTarget = nil\nlocal function findNearest()\n  local nearest, dist = nil, math.huge\n  for _, plr in ipairs(game.Players:GetPlayers()) do\n    if plr ~= game.Players.LocalPlayer then\n      local d = (plr.Character.HRP.Position - game.Players.LocalPlayer.Character.HRP.Position).Magnitude\n      if d < dist then dist, nearest = d, plr end\n    end\n  end\n  return nearest\nend', 'HoodScript', 'Da Hood', 18450, ARRAY['aimlock', 'combat', 'pvp']),
('Brookhaven RP Troll', 'Troll menu with fly, noclip, invisible, and prank tools. Fun scripts for roleplay servers.', '-- Brookhaven Troll Menu\nlocal menu = Instance.new("ScreenGui")\n-- Fly, Noclip, Invisible, Prank tools\n-- Full GUI with toggle buttons', 'TrollMaster', 'Brookhaven RP', 9870, ARRAY['troll', 'fun', 'roleplay']),
('Doors ESP & Walkspeed', 'See all entities through walls, adjustable walkspeed, and auto-open doors. Great for runs.', '-- Doors ESP\nlocal entities = workspace.Entities:GetChildren()\nfor _, ent in ipairs(entities) do\n  local hl = Instance.new("Highlight")\n  hl.Parent = ent\nend', 'DoorScript', 'Doors', 7340, ARRAY['esp', 'horror', 'utility']),
('Tower of Hell Speed', 'Adjustable speed and jump power. Auto-complete tower with one click.', '-- TOH Speed\nlocal plr = game.Players.LocalPlayer\nlocal char = plr.Character\nchar.Humanoid.WalkSpeed = 100\nchar.Humanoid.JumpPower = 100', 'TowerKing', 'Tower of Hell', 5620, ARRAY['speed', 'obby', 'utility']),
('Murder Mystery 2 ESP', 'See murderer and sheriff through walls. Know who has the gun at all times.', '-- MM2 ESP\nlocal mm2 = game.Players:GetPlayers()\nfor _, plr in ipairs(mm2) do\n  if plr.Role.Value == "Murderer" then\n    -- Highlight murderer in red\n  elseif plr.Role.Value == "Sheriff" then\n    -- Highlight sheriff in blue\n  end\nend', 'MysteryDev', 'Murder Mystery 2', 11200, ARRAY['esp', 'mystery', 'pvp']),
('Adopt Me Auto Trade', 'Auto trade pets with smart filtering. Accepts only fair trades based on pet values.', '-- Adopt Me Auto Trade\nlocal function autoTrade()\n  local myPets = game:GetService("ReplicatedStorage").GetPets:InvokeServer()\n  -- Filter and auto-accept fair trades\nend', 'AdoptTrader', 'Adopt Me', 6430, ARRAY['auto', 'trade', 'pets']),
('Jailbreak Auto Rob', 'Auto rob stores, banks, and trains. Includes auto-escape and police avoidance.', '-- Jailbreak Auto Rob\nlocal stores = workspace.Stores:GetChildren()\nfor _, store in ipairs(stores) do\n  -- Teleport and rob each store\n  game.Players.LocalPlayer.Character.HRP.CFrame = store.Entry.CFrame\n  wait(1)\n  store.Rob:FireServer()\nend', 'Jailbreaker', 'Jailbreak', 19870, ARRAY['auto', 'rob', 'action']),
('Universal Fly Script', 'Works in almost every Roblox game. Smooth fly controls with speed adjustment.', '-- Universal Fly\nlocal plr = game.Players.LocalPlayer\nlocal mouse = plr:GetMouse()\nlocal flying = false\nlocal speed = 50\nlocal function toggleFly()\n  flying = not flying\n  if flying then\n    -- Enable fly\n  end\nend\nmouse.KeyDown:Connect(function(k) if k == "f" then toggleFly() end end)', 'SkyWalker', 'Universal', 13450, ARRAY['fly', 'universal', 'utility'])
ON CONFLICT DO NOTHING;
