-- Shared catalog of sample places (user_id NULL = visible to every signed-in user, editable by no one).
-- All names, people and stories are fictional; neighborhoods and cities are real Bay Area locations.
insert into public.places (id, user_id, name, neighborhood, city, address, cuisine, price_tier, lat, lng, source) values
  ('0a000000-0000-4000-8000-000000000001', null, 'Fig & Fennel Kitchen', 'Downtown', 'Palo Alto', '412 University Ave', 'Mediterranean', 3, 37.4443, -122.1598, 'seed'),
  ('0a000000-0000-4000-8000-000000000002', null, 'Sunday Noodle House', 'Inner Sunset', 'San Francisco', '1340 9th Ave', 'Taiwanese', 2, 37.7648, -122.4663, 'seed'),
  ('0a000000-0000-4000-8000-000000000003', null, 'Tidewater Poke', 'Park Street', 'Alameda', '1520 Park St', 'Hawaiian', 2, 37.7653, -122.2416, 'seed'),
  ('0a000000-0000-4000-8000-000000000004', null, 'La Milpa Cocina', 'Mission District', 'San Francisco', '2918 24th St', 'Oaxacan', 2, 37.7527, -122.4141, 'seed'),
  ('0a000000-0000-4000-8000-000000000005', null, 'The Green Ladle', 'Temescal', 'Oakland', '4931 Telegraph Ave', 'Soups & bowls', 2, 37.8341, -122.2638, 'seed'),
  ('0a000000-0000-4000-8000-000000000006', null, 'Little Bear Bakery', 'Castro Street', 'Mountain View', '780 Castro St', 'Bakery & café', 1, 37.3943, -122.0795, 'seed'),
  ('0a000000-0000-4000-8000-000000000007', null, 'Saffron & Sage', 'Gourmet Ghetto', 'Berkeley', '1604 Shattuck Ave', 'Persian', 3, 37.8795, -122.2693, 'seed'),
  ('0a000000-0000-4000-8000-000000000008', null, 'Pier Nine Oyster Bar', 'Harbor', 'Half Moon Bay', '9 Johnson Pier', 'Seafood', 4, 37.5021, -122.4829, 'seed'),
  ('0a000000-0000-4000-8000-000000000009', null, 'Hearth & Hill', 'Downtown', 'Los Gatos', '55 N Santa Cruz Ave', 'Wood-fired Italian', 3, 37.2266, -121.9836, 'seed'),
  ('0a000000-0000-4000-8000-00000000000a', null, 'Corner Bánh Mì', 'Willow Glen', 'San Jose', '1190 Lincoln Ave', 'Vietnamese', 1, 37.3039, -121.9007, 'seed'),
  ('0a000000-0000-4000-8000-00000000000b', null, 'Orchard Table', 'Downtown', 'Mill Valley', '38 Throckmorton Ave', 'Californian', 4, 37.9060, -122.5450, 'seed'),
  ('0a000000-0000-4000-8000-00000000000c', null, 'Daybreak Dumplings', 'Downtown', 'Redwood City', '2210 Broadway', 'Chinese', 1, 37.4852, -122.2275, 'seed')
on conflict (id) do nothing;

-- Fills the calling user's journal with sample visits, wishlist items and lists.
-- Does nothing if they already have any of those, so it can't clobber real entries.
create function public.seed_sample_journal() returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  uid uuid := auth.uid();
  list_peninsula uuid := gen_random_uuid();
  list_cozy uuid := gen_random_uuid();
begin
  if uid is null then
    raise exception 'not authenticated' using errcode = '28000';
  end if;
  if exists (select 1 from public.visits where user_id = uid)
     or exists (select 1 from public.wishlist_items where user_id = uid)
     or exists (select 1 from public.place_lists where user_id = uid) then
    return;
  end if;

  insert into public.visits (user_id, place_id, visited_at, rating, dish_name, photo_url, would_go_back, price_tier, health_tags, feeling, note, story) values
    (uid, '0a000000-0000-4000-8000-000000000002', now() - interval '1 day', 'loved', 'Beef noodle soup', '/seed/noodles-beef-soup.svg', true, 2, '{comforting,protein_rich}', 'satisfied',
      'Rainy-day order. The broth tastes like it has been going since morning.',
      'Mei runs the counter and told me the broth simmers for twelve hours. Her mother taught her, and she still hand-pulls the noodles on Sundays.'),
    (uid, '0a000000-0000-4000-8000-000000000001', now() - interval '4 days', 'loved', 'Roasted cauliflower & tahini bowl', '/seed/bowl-roasted-cauliflower.svg', true, 3, '{veggie_forward,fresh}', 'energized',
      'Lots of herbs and a squeeze of lemon. Good for a work lunch.', null),
    (uid, '0a000000-0000-4000-8000-000000000003', now() - interval '7 days', 'fine', 'Salmon poke bowl', '/seed/poke-salmon-bowl.svg', true, 2, '{light,protein_rich}', 'comfortable',
      'Fresh fish, the sauce was a bit sweet for me. Next time I’ll ask for it on the side.', null),
    (uid, '0a000000-0000-4000-8000-000000000004', now() - interval '10 days', 'loved', 'Tlayuda with black beans', '/seed/tlayuda-black-beans.svg', true, 2, '{indulgent,comforting}', 'sleepy',
      'Big enough to share. We took half home.',
      'The owner, Rosa, grinds the masa herself and sources her chiles from her cousin’s farm outside Oaxaca City. She slid a free mezcal sample across the counter “for the story.”'),
    (uid, '0a000000-0000-4000-8000-000000000005', now() - interval '14 days', 'fine', 'Lentil & kale soup', '/seed/soup-lentil-kale.svg', false, 2, '{light,veggie_forward}', 'still_hungry',
      'Pleasant but small. I’d pair it with bread next time.', null),
    (uid, '0a000000-0000-4000-8000-000000000002', now() - interval '16 days', 'loved', 'Cold sesame noodles & scallion pancake', '/seed/noodles-cold-sesame.svg', true, 2, '{comforting}', 'satisfied', null, null),
    (uid, '0a000000-0000-4000-8000-000000000009', now() - interval '19 days', 'not_for_me', 'Four-cheese pizza', '/seed/pizza-four-cheese.svg', false, 3, '{indulgent}', 'sleepy',
      'Beautiful crust, just too rich for my taste. I’d try the seasonal salad next time.', null),
    (uid, '0a000000-0000-4000-8000-000000000007', now() - interval '23 days', 'loved', 'Herb kuku sabzi plate', '/seed/kuku-sabzi-plate.svg', true, 3, '{veggie_forward,protein_rich,fresh}', 'energized',
      'So many herbs. Came with warm flatbread and a tangy yogurt dip.',
      'Chef Darya opened this place after years of cooking for family gatherings. She grows the mint and dill on the restaurant’s back patio and says the kuku recipe is her grandmother’s.');

  insert into public.wishlist_items (user_id, place_id, note, created_at) values
    (uid, '0a000000-0000-4000-8000-000000000008', 'Special occasion. A friend raves about the grilled oysters.', now() - interval '5 days'),
    (uid, '0a000000-0000-4000-8000-00000000000b', 'Seasonal tasting menu, maybe for a birthday.', now() - interval '12 days'),
    (uid, '0a000000-0000-4000-8000-000000000006', 'Seeded sourdough for a weekend morning.', now() - interval '20 days');

  insert into public.place_lists (id, user_id, name, description) values
    (list_peninsula, uid, 'Healthy-ish lunches on the Peninsula', 'Easy work-day lunches that leave me feeling good.'),
    (list_cozy, uid, 'Cozy rainy-day bowls', null);

  insert into public.place_list_items (list_id, place_id, position) values
    (list_peninsula, '0a000000-0000-4000-8000-000000000001', 0),
    (list_peninsula, '0a000000-0000-4000-8000-000000000006', 1),
    (list_peninsula, '0a000000-0000-4000-8000-00000000000c', 2),
    (list_cozy, '0a000000-0000-4000-8000-000000000002', 0),
    (list_cozy, '0a000000-0000-4000-8000-000000000005', 1),
    (list_cozy, '0a000000-0000-4000-8000-00000000000a', 2);
end
$$;

revoke execute on function public.seed_sample_journal() from public, anon;
grant execute on function public.seed_sample_journal() to authenticated;
