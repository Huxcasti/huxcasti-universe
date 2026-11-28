(() => {
  'use strict';
  const lang = window.HuxcastiLanguage;
  lang.add({
    'Explora el panel del Cine Manuel Nieves con reservaciones, tandas y escaneos ficticios.': 'Explore the cinema dashboard with sample bookings, showtimes and admission scans.',
    'Administración del cine · Demo | Huxcasti': 'Cinema administration · Demo | Huxcasti',
    '← Volver al proyecto': '← Back to the project',
    'Administración del cine': 'Cinema administration',
    'Demo de solo lectura': 'Read-only demo',
    'Las reservaciones, ventas y entradas que ves son ficticias.': 'All bookings, sales and admissions shown here are fictional.',
    'Secciones del panel': 'Dashboard sections',
    'Reservaciones': 'Bookings', 'Películas': 'Movies', 'Tandas': 'Showtimes', 'Empleados y escaneos': 'Staff and scans',
    'Taquillas vendidas': 'Tickets sold', 'Ventas pagadas': 'Paid sales', 'Entradas utilizadas': 'Tickets used',
    'Consulta los asientos, el pago y la entrada de cada grupo.': 'Review seats, payment and admission for each group.',
    'Entrada': 'Admission', 'Todas': 'All', 'Utilizada': 'Checked in', 'Por validar': 'Awaiting check-in',
    'No hay reservaciones con ese estado.': 'No bookings match this status.',
    'Películas registradas': 'Movie listings', 'Cartelera, duración y clasificación de cada película.': 'Film titles, running times and ratings.',
    'Tandas registradas': 'Scheduled showtimes', 'Horarios y taquillas reservadas por función.': 'Showtimes and tickets booked for each screening.',
    'Cada asiento validado cuenta como una entrada.': 'Each seat checked in counts as one admission.',
    'Historial de escaneos': 'Scan history', 'Detalle de la reservación': 'Booking details', 'Cerrar': 'Close',
    'Reservación': 'Booking', 'Película': 'Film', 'Tanda': 'Showtime', 'Asientos': 'Seats', 'Total': 'Total',
    'Estado': 'Status', 'Duración': 'Running time', 'Clasificación': 'Rating', 'En cartelera': 'Now showing',
    'Próximamente': 'Coming soon', 'Idioma': 'Language', 'Español': 'Spanish', 'Inglés con subtítulos': 'English with subtitles',
    'Taquillas reservadas': 'Tickets booked', 'Responsable': 'Staff member', 'Escaneos': 'Scans', 'Taquillas': 'Tickets',
    'Último escaneo': 'Last scan', 'Sin escaneos': 'No scans', 'Pago': 'Payment', 'Pagado': 'Paid',
    'Entrada norte': 'North entrance', 'Entrada sur': 'South entrance', 'Fecha y hora': 'Date and time'
  });

  lang.add({"Reservaciones, películas, tandas, empleados y configuración.":"Bookings, movies, showtimes, staff and settings.","Modo demostración.":"Demo mode.","Todos los datos son ficticios. Los cambios se simulan en esta pestaña y no afectan al cine real.":"All data is fictional. Changes are simulated in this tab and do not affect the real cinema.","Actualizar":"Refresh","Reiniciar demo":"Reset demo","🎟 Reservaciones":"🎟 Bookings","🎬 Películas":"🎬 Movies","🕒 Tandas":"🕒 Showtimes","👥 Empleados":"👥 Staff","🔐 Configuración":"🔐 Settings","Ventas y entradas registradas.":"Recorded sales and admissions.","Añadir película":"Add movie","Título":"Title","Descripción":"Description","Nombre de la película":"Movie title","Sinopsis o información":"Synopsis or information","Afiche de la película":"Movie poster","Afiche ficticio de demostración":"Sample demo poster","Tráiler de la película":"Movie trailer","Carga de archivos desactivada en la demo":"File uploads disabled in demo","Duración en minutos":"Running time in minutes","Mostrar como “Próximamente”":"Show as coming soon","Guardar película":"Save movie","Limpiar":"Clear","Edita, activa o elimina películas de prueba.":"Edit, activate or remove sample movies.","Precios generales de taquillas":"General ticket prices","Precios de ejemplo para todas las tandas de la demo.":"Sample prices for all demo showtimes.","Adulto":"Adult","Niño":"Child","Senior":"Senior","Guardar precios":"Save prices","Añadir tanda":"Add showtime","Fecha":"Date","Hora":"Time","Idioma de la tanda":"Showtime language","Inglés":"English","Tanda activa y disponible":"Showtime active and available","Guardar tanda":"Save showtime","Horarios disponibles para cada película.":"Available showtimes for each movie.","Añadir empleado":"Add staff member","Nombre completo":"Full name","Nombre ficticio":"Fictional name","Usuario":"Username","No introduzcas contraseñas ni datos personales reales.":"Do not enter passwords or real personal information.","Empleado activo":"Active staff member","Guardar empleado":"Save staff member","Configuración del administrador":"Administrator settings","En el sistema real esta sección permite cambiar la contraseña. Por seguridad, la demostración no solicita ni guarda credenciales.":"In the actual system this section changes the password. For safety the demo does not request or store credentials.","Cambios guardados en la demo.":"Changes saved in the demo.","Demo actualizada.":"Demo refreshed.","Afiche":"Poster","Acciones":"Actions","Editar":"Edit","Eliminar":"Delete","Activo":"Active","Inactivo":"Inactive","Cliente":"Customer"});

  // All records in this view are fixtures. A booking's seats are admitted together.
  const movies = {
    bahia: {title:'Luces de la bahía', minutes:94, rating:'PG', status:'En cartelera'},
    horizonte: {title:'El último horizonte', minutes:112, rating:'PG-13', status:'En cartelera'},
    viaje: {title:'Viaje a las estrellas', minutes:86, rating:'G', status:'Próximamente'}
  };
  const shows = {
    matinee: {movie:'bahia', time:'2026-11-14T15:00:00-04:00', language:'Español'},
    early: {movie:'horizonte', time:'2026-11-14T18:00:00-04:00', language:'Inglés con subtítulos'},
    late: {movie:'bahia', time:'2026-11-14T20:30:00-04:00', language:'Español'},
    sunday: {movie:'horizonte', time:'2026-11-15T16:00:00-04:00', language:'Inglés con subtítulos'}
  };
  const staff = {north:'Entrada norte', south:'Entrada sur'};
  const staffUsers = {north:'entrada_norte_demo',south:'entrada_sur_demo'};
  const staffActive = {north:true,south:true};
  const clients={'DEMO-104':'Cliente demo 04','DEMO-103':'Cliente demo 03','DEMO-102':'Cliente demo 02','DEMO-101':'Cliente demo 01'};
  let movieEdit=null; let counter=0;
  const bookings = [
    {id:'DEMO-104', show:'sunday', seats:['D4','D5'], cents:1600},
    {id:'DEMO-103', show:'late', seats:['F1','F2','F3'], cents:2200},
    {id:'DEMO-102', show:'early', seats:['C7'], cents:800, scan:{staff:'south', time:'2026-11-14T17:54:00-04:00'}},
    {id:'DEMO-101', show:'matinee', seats:['B3','B4'], cents:1400, scan:{staff:'north', time:'2026-11-14T14:48:00-04:00'}}
  ];
  const scanned = bookings.filter(booking => booking.scan);
  const byId = id => document.getElementById(id);
  const filter = byId('entry-filter');
  const dialog = byId('booking-detail');
  let selectedBooking;
  const t = value => lang.text(value);
  const locale = () => lang.current() === 'en' ? 'en-US' : 'es-PR';
  const dateTime = value => new Intl.DateTimeFormat(locale(), {
    month:'short', day:'numeric', hour:'numeric', minute:'2-digit', timeZone:'America/Puerto_Rico'
  }).format(new Date(value));
  const money = cents => new Intl.NumberFormat(locale(), {style:'currency',currency:'USD'}).format(cents / 100);
  const seatCount = records => records.reduce((count, row) => count + row.seats.length, 0);
  const state = booking => booking.scan ? 'Utilizada' : 'Por validar';
  const film = booking => movies[shows[booking.show].movie].title;

  function el(tag, value) {
    const node = document.createElement(tag);
    if (value !== undefined) node.textContent = value;
    return node;
  }
  function pairs(id, rows) {
    const groups = rows.map(([key, value]) => {
      const group = el('div');
      group.append(el('dt', t(key)), el('dd', value));
      return group;
    });
    byId(id).replaceChildren(...groups);
  }
  function renderTable(id, headers, rows, label) {
    const table = el('table');
    table.setAttribute('aria-label', t(label));
    const head = table.createTHead().insertRow();
    for (const key of headers) {
      const th = el('th', t(key)); th.scope = 'col'; head.append(th);
    }
    const body = table.createTBody();
    for (const values of rows) {
      const row = body.insertRow();
      values.forEach((value, index) => {
        const cell = row.insertCell(); cell.dataset.label = t(headers[index]); cell.append(value);
      });
    }
    byId(id).replaceChildren(table);
  }
  function showDetails(booking) {
    selectedBooking = booking;
    pairs('details', [
      ['Reservación',booking.id], ['Película',film(booking)], ['Tanda',dateTime(shows[booking.show].time)],
      ['Asientos',booking.seats.join(', ')], ['Total',money(booking.cents)], ['Pago',t('Pagado')], ['Entrada',t(state(booking))]
    ]);
    if (!dialog.open) dialog.showModal();
  }
  function renderBookings() {
    const rows = bookings.filter(b => filter.value === 'all' || (filter.value === 'used') === Boolean(b.scan));
    renderTable('bookings-table',['Fecha','Cliente','Reservación','Película','Tanda','Asientos','Total','Pago','Entrada'],rows.map(b => {
      const link = el('button',b.id); link.type = 'button'; link.className = 'detail-link';
      link.setAttribute('aria-haspopup','dialog');
      link.addEventListener('click', () => showDetails(b));
      const badge = el('span',t(state(b))); badge.className = b.scan ? 'state' : 'state pending';
      return [dateTime(shows[b.show].time),clients[b.id],link, film(b), dateTime(shows[b.show].time), b.seats.join(', '), money(b.cents), t('Pagado'), badge];
    }), 'Reservaciones');
    byId('no-results').hidden = rows.length > 0;
  }
  function render() {
    // Translate the static shell first and then rebuild the formatted tables for this locale.
    lang.localize(document.documentElement);
    pairs('metrics', [
      ['Reservaciones',bookings.length], ['Taquillas vendidas',seatCount(bookings)],
      ['Ventas pagadas',money(bookings.reduce((sum,b) => sum + b.cents,0))], ['Entradas utilizadas',seatCount(scanned)]
    ]);
    renderBookings();
    const movieSelect=byId('show-movie'), previous=movieSelect.value;
    movieSelect.replaceChildren(...Object.entries(movies).map(([key,m])=>{const o=el('option',m.title);o.value=key;return o;}));if(movies[previous])movieSelect.value=previous;
    renderTable('movies-table',['Afiche','Película','Duración','Clasificación','Estado','Acciones'],Object.entries(movies).map(([key,m])=>{
      const poster=el('span',m.title);poster.className='demo-poster';
      const actions=el('div'); const edit=el('button',t('Editar'));edit.type='button';edit.className='btn btn-secondary btn-small';edit.addEventListener('click',()=>{movieEdit=key;byId('movie-name').value=m.title;byId('movie-description').value=m.description||'';byId('movie-minutes').value=m.minutes;byId('movie-rating').value=m.rating;byId('movie-form').elements.coming.checked=m.status==='Próximamente';byId('movie-name').focus();});actions.append(edit);
      if(!Object.values(shows).some(s=>s.movie===key)){const del=el('button',t('Eliminar'));del.type='button';del.className='btn btn-danger btn-small';del.addEventListener('click',()=>{delete movies[key];render();notify('Cambios guardados en la demo.');});actions.append(del);}
      return [poster,m.title,m.minutes+' min',m.rating,t(m.status),actions];
    }), 'Películas registradas');
    renderTable('shows-table',['Película','Tanda','Idioma','Taquillas reservadas','Estado'],
      Object.entries(shows).map(([id,s]) => [movies[s.movie].title,dateTime(s.time),t(s.language),
        String(seatCount(bookings.filter(b => b.show === id))),t(s.active===false?'Inactivo':'Activo')]), 'Tandas registradas');
    renderTable('staff-table',['Responsable','Usuario','Estado','Escaneos','Taquillas','Último escaneo'],
      Object.entries(staff).map(([id,name]) => {
        const activity = scanned.filter(b => b.scan.staff === id);
        return [t(name),staffUsers[id]||'demo',t(staffActive[id]?'Activo':'Inactivo'),String(activity.length),String(seatCount(activity)),activity.length ? dateTime(activity[0].scan.time) : t('Sin escaneos')];
      }), 'Empleados y escaneos');
    renderTable('scans-table',['Fecha y hora','Responsable','Película','Asientos'],
      scanned.map(b => [dateTime(b.scan.time),t(staff[b.scan.staff]),film(b),b.seats.join(', ')]), 'Historial de escaneos');
    if (dialog.open) showDetails(selectedBooking);
  }
  const buttons = document.querySelectorAll('button[data-view]');
  for (const tab of buttons) {
    tab.addEventListener('click', () => {
      for (const button of buttons) {
        const active = button === tab;
        byId(button.dataset.view).hidden = !active;
        if (active) button.setAttribute('aria-current','page');
        else button.removeAttribute('aria-current');
      }
    });
  }
  filter.addEventListener('change',renderBookings);
  byId('close-detail').addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => {selectedBooking = undefined;});
  function notify(message){byId('demo-status').textContent=t(message);}
  byId('refresh-demo').addEventListener('click',()=>{render();notify('Demo actualizada.');});
  byId('reset-demo').addEventListener('click',()=>location.reload());
  byId('movie-form').addEventListener('reset',()=>{movieEdit=null;});
  byId('movie-form').addEventListener('submit',e=>{e.preventDefault();const form=e.currentTarget,d=new FormData(form),key=movieEdit||'movie-demo-'+(++counter);movies[key]={title:String(d.get('title')).trim(),description:String(d.get('description')),minutes:Number(d.get('minutes')),rating:String(d.get('rating')),status:d.has('coming')?'Próximamente':'En cartelera'};form.reset();render();notify('Cambios guardados en la demo.');});
  byId('show-form').addEventListener('submit',e=>{e.preventDefault();const form=e.currentTarget,d=new FormData(form);if(!movies[d.get('movie')])return;shows['show-demo-'+(++counter)]={movie:d.get('movie'),time:d.get('date')+'T'+d.get('time')+':00-04:00',language:d.get('language'),active:d.has('active')};form.reset();render();notify('Cambios guardados en la demo.');});
  byId('staff-form').addEventListener('submit',e=>{e.preventDefault();const form=e.currentTarget,d=new FormData(form),id='staff-demo-'+(++counter);staff[id]=String(d.get('name')).trim();staffUsers[id]=String(d.get('user')).trim();staffActive[id]=d.has('active');form.reset();render();notify('Cambios guardados en la demo.');});
  byId('prices-form').addEventListener('submit',e=>{e.preventDefault();notify('Cambios guardados en la demo.');});
  render();
  lang.subscribe(render);
})();
