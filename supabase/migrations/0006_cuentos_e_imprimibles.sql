-- PLANECITOS · Cuentitos mágicos + Pequeños artistas (imprimibles)
-- Ejecutar en Supabase > SQL Editor

-- ---------- CUENTOS ----------
create table if not exists public.stories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  summary text not null,
  min_age smallint not null check (min_age between 2 and 5),
  max_age smallint not null check (max_age between 2 and 5),
  minutes smallint not null,
  moment text not null,            -- dormir, tranquilo, cualquier momento
  theme text not null,
  character_age smallint not null check (character_age between 2 and 5),
  pages text[] not null default '{}',   -- {nombre} se reemplaza por el apodo del niño
  question text not null default '',
  game text not null default '',
  activity_slug text,
  premium boolean not null default true,
  published boolean not null default true,
  created_at timestamptz not null default now()
);
alter table public.stories enable row level security;
drop policy if exists "ver cuentos gratis" on public.stories;
create policy "ver cuentos gratis" on public.stories
  for select to anon, authenticated using (published and not premium);
drop policy if exists "ver cuentos premium" on public.stories;
create policy "ver cuentos premium" on public.stories
  for select to authenticated using (published and premium and public.is_premium());

-- Catálogo público de cuentos (portadas, sin el texto)
create or replace function public.get_story_catalog()
returns table (id uuid, slug text, title text, summary text, min_age smallint, max_age smallint,
  minutes smallint, moment text, theme text, character_age smallint, premium boolean)
language sql stable security definer set search_path = ''
as $$
  select id, slug, title, summary, min_age, max_age, minutes, moment, theme, character_age, premium
  from public.stories where published order by premium, created_at;
$$;
grant execute on function public.get_story_catalog() to anon, authenticated;

-- ---------- IMPRIMIBLES ----------
create table if not exists public.printables (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text not null,
  kind text not null,              -- colorear, laberinto, une-los-puntos, recortables
  min_age smallint not null,
  max_age smallint not null,
  file_path text not null,         -- ruta dentro del bucket "imprimibles"
  premium boolean not null default true,
  published boolean not null default true,
  created_at timestamptz not null default now()
);
alter table public.printables enable row level security;
drop policy if exists "ver imprimibles" on public.printables;
create policy "ver imprimibles" on public.printables
  for select to anon, authenticated using (published);   -- la ficha es pública; el PDF está protegido

-- Bucket privado para los PDF
insert into storage.buckets (id, name, public) values ('imprimibles', 'imprimibles', false)
on conflict (id) do nothing;

drop policy if exists "descargar imprimibles gratis" on storage.objects;
create policy "descargar imprimibles gratis" on storage.objects
  for select to anon, authenticated
  using (bucket_id = 'imprimibles' and (storage.foldername(name))[1] = 'gratis');

drop policy if exists "descargar imprimibles premium" on storage.objects;
create policy "descargar imprimibles premium" on storage.objects
  for select to authenticated
  using (bucket_id = 'imprimibles' and (storage.foldername(name))[1] = 'premium' and public.is_premium());

-- ---------- CONTENIDO ----------
insert into public.stories (slug, title, summary, min_age, max_age, minutes, moment, theme, character_age, pages, question, game, activity_slug, premium)
values
  ('luna-y-la-estrella-perdida', 'Luna y la estrella perdida', 'A Luna se le cayó una estrellita del cielo. {nombre} la ayuda a buscarla por toda la casa.', 2, 5, 5, 'dormir', 'Sueño e imaginación', 5, array['Una noche, Luna miró el cielo y contó sus estrellas: una, dos, tres… ¡y faltaba una!', '«¿Dónde estará mi estrellita?», preguntó Luna, con su carita de media luna un poco triste.', '{nombre} escuchó a Luna y dijo: «¡Yo te ayudo a buscarla!». Y los dos salieron de puntillas.', 'Buscaron debajo de la cama. Solo había una media perdida y un carrito azul.', 'Buscaron detrás de la cortina. Solo había un poquito de polvo que les hizo estornudar: ¡achís!', 'Entonces {nombre} vio una lucecita junto a la ventana. Era la estrellita, que se había quedado mirando la ciudad.', 'Luna la abrazó despacio y la devolvió al cielo. Brillaba más que nunca.', '«Gracias, {nombre}», susurró Luna. «Ahora todas mis estrellas pueden dormir. Y tú también.»']::text[], '¿Dónde crees que se esconden las estrellas durante el día?', 'Recorta tres estrellas de papel y escóndelas en la habitación. Antes de dormir, que tu hijo las encuentre con una linterna.', 'sombras-con-linterna', false),
  ('cubo-construye-una-casa', 'Cubo construye una casa para todos', 'Cubo quiere construir la casa más grande del mundo, pero descubre que es mejor si cabe todo el mundo.', 3, 5, 5, 'cualquier momento', 'Amistad y valores', 3, array['A Cubo le encanta construir. Un día dijo: «¡Voy a hacer la casa más alta del mundo!».', 'Puso un bloque, otro bloque y otro más. La torre era altísima… pero muy, muy flaquita.', 'Sol llegó y preguntó: «¿Puedo entrar?». Pero no cabía. La casa era solo para Cubo.', 'Pico quiso entrar, y Luna también. Nadie cabía. Cubo se puso pensativo.', 'Entonces {nombre} le dio una idea: «¿Y si la haces menos alta y más ancha?».', 'Cubo desarmó la torre y empezó otra vez, con espacio para todos.', 'Cuando terminó, entraron Sol, Pico, Luna y {nombre}. ¡Hasta sobró un rincón para un gato!', 'Cubo sonrió con su sonrisa cuadrada: «La mejor casa no es la más alta. Es la que tiene espacio para los amigos».']::text[], 'Si construyeras una casa, ¿a quién invitarías a vivir contigo?', 'Construyan juntos una casa con cojines y cobijas donde quepa toda la familia.', 'fortaleza-de-cojines', true),
  ('pico-y-el-charco-gigante', 'Pico y el charco gigante', 'Después de la lluvia aparece un charco enorme en el camino. ¿Cómo lo cruzarán Pico y {nombre}?', 3, 5, 4, 'cualquier momento', 'Animales y naturaleza', 4, array['Llovió toda la mañana. Cuando salió el sol, Pico salió corriendo al parque con {nombre}.', 'Pero en medio del camino había un charco gigante. ¡Tan grande como un lago!', 'Pico quiso saltarlo de un brinco… y casi se cae. ¡Era demasiado grande!', '{nombre} miró alrededor y vio piedras redondas cerca del charco.', '«Pongamos piedras para hacer un camino», dijo {nombre}. Y juntos las fueron acomodando.', 'Paso a paso, de piedra en piedra, cruzaron el charco sin mojarse los pies.', 'Del otro lado, Pico se rio: «¡Lo cruzamos juntos! Ahora… ¿saltamos dentro del charco?».', 'Y saltaron, ¡splash!, porque a veces mojarse también es parte de la aventura.']::text[], 'Si encontraras un charco gigante, ¿lo cruzarías o saltarías dentro?', 'Pongan papeles en el piso como piedras y crucen la sala sin pisar el «agua».', 'el-camino-de-cintas', true),
  ('sol-aprende-a-esperar', 'Sol aprende a esperar', 'Sol quiere que las galletas estén listas YA. {nombre} le enseña juegos para que la espera pase volando.', 2, 5, 4, 'cualquier momento', 'Emociones y bienestar', 2, array['Sol y {nombre} hicieron galletas. Las pusieron en el horno y Sol preguntó: «¿Ya están?».', '«Todavía no», dijo la abuela. «Hay que esperar un ratito.»', 'Sol esperó un segundo. «¿Y ahora?». «Todavía no.»', 'Sol se puso rojo, rojo como un tomate. ¡Esperar era dificilísimo!', 'Entonces {nombre} tuvo una idea: «Mientras esperamos, juguemos a ser estatuas».', 'Jugaron a las estatuas, contaron hasta diez y cantaron una canción.', '¡Ding! Sonó el horno. Las galletas olían delicioso.', 'Sol mordió una y dijo: «Esperar es más fácil cuando juegas con un amigo».']::text[], '¿Qué es lo que más te cuesta esperar? ¿Qué podrías jugar mientras tanto?', 'La próxima vez que tengan que esperar, jueguen al semáforo o a las estatuas.', 'el-semaforo', true),
  ('la-caja-de-los-abrazos', 'La caja de los abrazos', 'Cubo encuentra una caja vacía y la convierte en algo muy especial: una caja para guardar abrazos.', 2, 5, 4, 'tranquilo', 'Emociones y bienestar', 3, array['Un día, Cubo encontró una caja vacía. «¿Qué puedo guardar aquí?», se preguntó.', 'Pensó en guardar juguetes, pero ya tenía un cajón. Pensó en guardar piedras, pero pesaban mucho.', 'Entonces vio a {nombre} un poquito triste y le dio un abrazo grande.', '{nombre} sonrió. «¡Tus abrazos son los mejores!», le dijo.', 'Cubo tuvo una idea: «¡Esta será la caja de los abrazos!».', 'Cada amigo dejó un abrazo adentro: uno de Sol, uno de Pico, uno de Luna y uno de {nombre}.', 'Ahora, cuando alguien está triste, abre la caja… y le salen todos los abrazos juntos.', 'Y lo mejor es que la caja nunca se vacía, porque los abrazos siempre se pueden volver a llenar.']::text[], '¿A quién te gustaría darle un abrazo hoy?', 'Decoren una caja de verdad y llénenla de «abrazos»: dibujos, notas o simplemente un abrazo de cada persona de la casa.', 'como-me-siento', true),
  ('el-cumpleanos-de-cubo', 'El cumpleaños de Cubo', 'Es el cumpleaños de Cubo y cada amigo le prepara una sorpresa con lo que tiene en casa.', 3, 5, 5, 'cualquier momento', 'Amistad y valores', 3, array['Hoy era el cumpleaños de Cubo. Pero nadie le había dicho nada… ¿se les olvidó?', 'Cubo caminó por el parque un poquito triste.', 'Mientras tanto, Sol hacía un dibujo, Pico armaba una guirnalda de papel y Luna practicaba una canción.', 'Y {nombre} preparó lo más importante: una corona de cartón con estrellitas.', '«¡Sorpresa!», gritaron todos cuando Cubo llegó a casa.', 'Cubo no lo podía creer. Había dibujos, música, una corona… ¡y sus amigos!', '«No necesitaban comprar nada», dijo Cubo, emocionado. «Lo hicieron todo con sus manos.»', 'Y esa tarde bailaron, cantaron y comieron torta hasta que salió la luna.']::text[], '¿Qué regalo harías con tus manos para alguien que quieres?', 'Hagan una corona de cartón o papel para la próxima persona de la familia que cumpla años.', 'fiesta-de-peluches', true),
  ('la-nube-que-pintaba-colores', 'La nube que pintaba colores', 'Una nubecita quiere llover de colores en vez de agua. {nombre} y Sol la ayudan a lograrlo.', 2, 5, 4, 'cualquier momento', 'Sueño e imaginación', 2, array['Había una nubecita que siempre llovía agua. Gota, gota, gota. Siempre lo mismo.', '«Me aburre llover agua», le dijo a Sol. «Quisiera llover colores.»', 'Sol pensó y pensó. Entonces llamó a {nombre}: «¿Nos ayudas?».', '{nombre} trajo sus pinturas. Le dieron a la nubecita un poquito de rojo, de azul y de amarillo.', 'La nubecita mezcló todo y… ¡llovió verde, morado y naranja!', 'Las flores quedaron de colores. Los charcos también. ¡Hasta el perro del vecino quedó con manchitas!', 'Cuando salió Sol, apareció el arcoíris más bonito que se había visto.', 'La nubecita se rio: «Mañana lloveré agua otra vez. Las plantas también tienen sed».']::text[], 'Si pudieras llover algo distinto al agua, ¿qué sería?', 'Mezclen dos colores de pintura y descubran qué color nuevo aparece.', 'laboratorio-de-colores', true),
  ('el-farol-de-las-luciernagas', 'El farol de las luciérnagas', 'A Pico no le gusta la oscuridad. Las luciérnagas y {nombre} le enseñan que la noche también tiene luz.', 3, 5, 5, 'dormir', 'Sueño e imaginación', 4, array['Cuando se apagaban las luces, a Pico no le gustaba nada. La oscuridad le parecía muy grande.', 'Una noche, {nombre} le dijo: «Ven, te quiero mostrar algo en el jardín».', 'Salieron despacito. Todo estaba oscuro y silencioso.', 'De pronto, una lucecita verde se encendió. Y otra. Y otra más. ¡Eran luciérnagas!', 'Las luciérnagas bailaban alrededor de Pico como si fueran un farol mágico.', '«La noche no está vacía», dijo {nombre}. «Está llena de cosas que solo se ven en la oscuridad.»', 'Pico miró el cielo y vio estrellas. Luna lo saludaba desde arriba.', 'Esa noche, Pico se durmió tranquilo, pensando en sus amigas de luz.']::text[], '¿Qué cosas bonitas solo se pueden ver de noche?', 'Apaguen las luces y hagan figuras de sombras en la pared con una linterna.', 'sombras-con-linterna', true),
  ('la-gran-sopa-compartida', 'La gran sopa compartida', 'Cada amigo tiene un solo ingrediente. Juntos, preparan la sopa más rica del bosque.', 3, 5, 5, 'cualquier momento', 'Amistad y valores', 4, array['Era un día frío y todos tenían hambre. Pero nadie tenía suficiente para hacer una sopa.', 'Sol tenía una zanahoria. Cubo, una papa. Pico, un poquito de arroz. Luna, una ramita de cilantro.', '«Con una zanahoria no se hace sopa», dijo Sol. Y cada uno se quedó con lo suyo.', 'Entonces {nombre} trajo una olla grande y dijo: «¿Y si lo ponemos todo junto?».', 'Uno a uno, echaron su ingrediente en la olla. La zanahoria, la papa, el arroz, el cilantro.', 'La olla empezó a burbujear y a oler delicioso.', 'Se sentaron todos alrededor y comieron sopa calientita hasta quedar felices.', 'Pico dijo: «Solos teníamos un poquito. Juntos tuvimos un banquete».']::text[], 'Si hicieran una sopa en familia, ¿qué pondría cada uno?', 'Jueguen a la cocinita: cada persona trae un «ingrediente» de juguete o de la cocina y preparan una sopa imaginaria juntos.', 'chef-por-un-dia', true),
  ('buenas-noches-planecitos', 'Buenas noches, planecitos', 'Sol, Cubo, Pico y Luna se despiden del día. Un cuento corto y suave para dormir.', 2, 5, 3, 'dormir', 'Sueño e imaginación', 5, array['El sol se escondió detrás de las montañas. Era hora de dormir.', 'Sol bostezó tan grande que casi se traga una nube. «Buenas noches», dijo, y se apagó despacito.', 'Cubo guardó sus bloques uno por uno, se puso su pijama de cuadritos y se acostó.', 'Pico dejó de saltar. Respiró hondo, como una montaña tranquila, y cerró los ojos.', 'Luna subió al cielo para cuidar a todos mientras dormían.', '{nombre} también se acomodó en su cama, calientito y tranquilo.', 'Respiró despacio: inhala… exhala… como las olas del mar.', 'Y desde el cielo, Luna susurró: «Buenas noches, {nombre}. Mañana hay un nuevo planecito».']::text[], '¿Qué fue lo más bonito que hiciste hoy?', 'Antes de dormir, cada uno cuenta una cosa bonita de su día.', 'la-nube-tranquila', false)
on conflict (slug) do nothing;

insert into public.printables (slug, title, description, kind, min_age, max_age, file_path, premium)
values
  ('colorea-a-sol', 'Colorea a Sol', 'Sol, el personaje de 2 años, con nubes y flores para colorear.', 'colorear', 2, 5, 'gratis/colorea-a-sol.pdf', false),
  ('colorea-a-cubo', 'Colorea a Cubo', 'Cubo y sus bloques de juguete para colorear.', 'colorear', 2, 5, 'premium/colorea-a-cubo.pdf', true),
  ('colorea-a-pico', 'Colorea a Pico', 'Pico de aventura entre árboles para colorear.', 'colorear', 3, 5, 'premium/colorea-a-pico.pdf', true),
  ('colorea-a-luna', 'Colorea a Luna', 'Luna y sus estrellas, ideal para antes de dormir.', 'colorear', 2, 5, 'premium/colorea-a-luna.pdf', true),
  ('laberinto-pico-facil', 'Ayuda a Pico a llegar a su cometa', 'Un laberinto corto con caminos anchos.', 'laberinto', 3, 4, 'premium/laberinto-pico-facil.pdf', true),
  ('laberinto-pico-dificil', 'El gran laberinto de Pico', 'Un laberinto más largo para los de 5 años.', 'laberinto', 5, 5, 'premium/laberinto-pico-dificil.pdf', true),
  ('une-los-puntos-cometa', 'Une los puntos: la cometa', 'Del 1 al 8 para descubrir la cometa de Planecitos.', 'une-los-puntos', 4, 5, 'premium/une-los-puntos-cometa.pdf', true),
  ('une-los-puntos-estrella', 'Une los puntos: la estrella de Luna', 'Del 1 al 10 para dibujar una estrella.', 'une-los-puntos', 4, 5, 'premium/une-los-puntos-estrella.pdf', true),
  ('mascaras-planecitos', 'Máscaras de los planecitos', 'Las caras de Sol, Cubo, Pico y Luna para recortar y jugar.', 'recortables', 3, 5, 'premium/mascaras-planecitos.pdf', true),
  ('tarjetas-de-emociones', 'Tarjetas de emociones', 'Cuatro caras para colorear y hablar de cómo se sienten.', 'recortables', 3, 5, 'premium/tarjetas-de-emociones.pdf', true)
on conflict (slug) do nothing;

select (select count(*) from public.stories) as cuentos, (select count(*) from public.printables) as imprimibles;
