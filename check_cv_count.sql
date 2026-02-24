SELECT 
  count(*) 
FROM resumes 
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'test@example.com' LIMIT 1);
