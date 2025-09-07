-- Add some sample community posts to showcase the functionality
INSERT INTO community_posts (title, body, industry_tag, user_id, tags, likes_count, comments_count) VALUES
  (
    'Welcome to the Real Estate Community!',
    'Hi everyone! 👋 Welcome to our Real Estate community. This is a space where we can share insights, ask questions, and connect with fellow professionals in the industry.

What would you like to see discussed here? Let''s start building this community together!',
    'Real Estate',
    '00000000-0000-0000-0000-000000000000',
    ARRAY['welcome', 'networking', 'community'],
    5,
    3
  ),
  (
    'Market Update: Q4 2024 Real Estate Trends',
    'I''ve been analyzing the latest market data and wanted to share some key insights:

📈 Property values in Dubai have increased by 12% this quarter
🏗️ New construction permits are up 23%
💰 Investment activity from international buyers has surged

What trends are you seeing in your area? Let''s discuss!

#RealEstate #MarketTrends #Dubai #Investment',
    'Real Estate',
    '00000000-0000-0000-0000-000000000000',
    ARRAY['market-trends', 'dubai', 'investment', 'q4-2024'],
    12,
    8
  ),
  (
    'Trading Strategies Discussion',
    'Hey Trading community! 📊

I''ve been experimenting with algorithmic trading strategies and wanted to get your thoughts. What''s working for you in the current market conditions?

Some areas I''m focusing on:
- Risk management protocols
- Market volatility indicators
- Automated stop-loss strategies

Share your experiences below! Always learning from this community.',
    'Trading',
    '00000000-0000-0000-0000-000000000000',
    ARRAY['algorithmic-trading', 'risk-management', 'strategies'],
    8,
    6
  ),
  (
    'E-commerce Platform Recommendation',
    'Hi E-commerce community! 🛒

I''m looking to expand my online business and need recommendations for scalable e-commerce platforms. Currently on Shopify but considering alternatives.

Requirements:
✅ Multi-currency support
✅ Advanced analytics
✅ API integrations
✅ Mobile-optimized

What platforms have worked well for your businesses? Any experiences with Magento, WooCommerce, or BigCommerce?',
    'E-commerce',
    '00000000-0000-0000-0000-000000000000',
    ARRAY['platforms', 'scaling', 'recommendations'],
    6,
    4
  ),
  (
    'Fintech Innovation Spotlight',
    'Exciting news in the Fintech space! 🚀

Just came across some interesting developments in UAE''s digital banking sector. The new regulations are creating amazing opportunities for innovation.

Key areas to watch:
💳 Digital wallets integration
🏦 Neo-banking solutions  
⚡ Instant payment systems
🔐 Blockchain security

Anyone working on fintech projects here? Would love to connect and share insights!',
    'Fintech',
    '00000000-0000-0000-0000-000000000000',
    ARRAY['innovation', 'digital-banking', 'uae', 'regulations'],
    15,
    9
  );

-- Add some sample comments to make the posts more engaging
INSERT INTO post_comments (post_id, user_id, comment) 
SELECT 
  cp.id,
  '00000000-0000-0000-0000-000000000000',
  CASE 
    WHEN cp.title = 'Welcome to the Real Estate Community!' THEN 'Thanks for creating this space! Looking forward to connecting with everyone here.'
    WHEN cp.title = 'Market Update: Q4 2024 Real Estate Trends' THEN 'Great insights! I''m seeing similar trends in Abu Dhabi. The international investment activity is particularly interesting.'
    WHEN cp.title = 'Trading Strategies Discussion' THEN 'I''ve had good results with momentum-based algorithms. Happy to discuss further!'
    WHEN cp.title = 'E-commerce Platform Recommendation' THEN 'We switched to BigCommerce last year and it''s been excellent for our scaling needs. The API is very robust.'
    WHEN cp.title = 'Fintech Innovation Spotlight' THEN 'The digital wallet space is definitely heating up. Working on something similar - would love to connect!'
  END
FROM community_posts cp
WHERE cp.title IN (
  'Welcome to the Real Estate Community!',
  'Market Update: Q4 2024 Real Estate Trends', 
  'Trading Strategies Discussion',
  'E-commerce Platform Recommendation',
  'Fintech Innovation Spotlight'
);

-- Add some post likes to make the community feel active
INSERT INTO post_likes (post_id, user_id)
SELECT 
  cp.id,
  '00000000-0000-0000-0000-000000000000'
FROM community_posts cp
LIMIT 3;