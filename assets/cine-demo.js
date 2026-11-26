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
    renderTable('bookings-table',['Reservación','Película','Tanda','Asientos','Total','Entrada'],rows.map(b => {
      const link = el('button',b.id); link.type = 'button'; link.className = 'detail-link';
      link.setAttribute('aria-haspopup','dialog');
      link.addEventListener('click', () => showDetails(b));
      const badge = el('span',t(state(b))); badge.className = b.scan ? 'state' : 'state pending';
      return [link, film(b), dateTime(shows[b.show].time), b.seats.join(', '), money(b.cents), badge];
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
    renderTable('movies-table',['Película','Duración','Clasificación','Estado'],
      Object.values(movies).map(m => [m.title,m.minutes+' min',m.rating,t(m.status)]), 'Películas registradas');
    renderTable('shows-table',['Película','Tanda','Idioma','Taquillas reservadas'],
      Object.entries(shows).map(([id,s]) => [movies[s.movie].title,dateTime(s.time),t(s.language),
        String(seatCount(bookings.filter(b => b.show === id)))]), 'Tandas registradas');
    renderTable('staff-table',['Responsable','Escaneos','Taquillas','Último escaneo'],
      Object.entries(staff).map(([id,name]) => {
        const activity = scanned.filter(b => b.scan.staff === id);
        return [t(name),String(activity.length),String(seatCount(activity)),activity.length ? dateTime(activity[0].scan.time) : t('Sin escaneos')];
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
  render();
  lang.subscribe(render);
})();
