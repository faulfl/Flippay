/**
 * FlipPlay - Cinema Edition
 * JavaScript Application Logic & TMDB API Integration
 */

// ==========================================
// 1. CONFIGURATION & STATE
// ==========================================
const CONFIG = {
  API_KEY: '4e44d9029b1270a757cddc766a1bcb63',
  API_BASE_URL: 'https://api.themoviedb.org/3',
  IMAGE_BASE_URL: 'https://image.tmdb.org/t/p/w500',
  BACKDROP_BASE_URL: 'https://image.tmdb.org/t/p/w1280',
  DEFAULT_LANGUAGE: 'en-US'
};

// Genre mapping ID to Name
const GENRES = {
  28: 'Action',
  12: 'Adventure',
  16: 'Animation',
  35: 'Comedy',
  80: 'Crime',
  99: 'Documentary',
  18: 'Drama',
  10751: 'Family',
  14: 'Fantasy',
  36: 'History',
  27: 'Horror',
  10402: 'Music',
  9648: 'Mystery',
  10749: 'Romance',
  878: 'Sci-Fi',
  53: 'Thriller',
  10752: 'War',
  37: 'Western'
};

// Curated high-reliability fallback movie collection (used if network/API is offline)
const FALLBACK_MOVIES = [
  {
    id: 933260,
    title: "The Substance",
    release_date: "2024-09-07",
    vote_average: 7.3,
    vote_count: 3200,
    poster_path: "/lqoMzCcZYEFK729Fc6rXxQI3umf.jpg",
    backdrop_path: "/7h6TqPB3ESmPFVosdbMwHG97xg6.jpg",
    genre_ids: [27, 878],
    overview: "Seorang selebritas yang memudar memutuskan untuk menggunakan obat pasar gelap, zat pengganda sel yang untuk sementara waktu menciptakan versi dirinya yang lebih muda dan lebih sempurna."
  },
  {
    id: 533535,
    title: "Deadpool & Wolverine",
    release_date: "2024-07-24",
    vote_average: 7.7,
    vote_count: 5800,
    poster_path: "/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg",
    backdrop_path: "/yDHYTfA3R0jFYba16jBB1ef8oIt.jpg",
    genre_ids: [28, 35, 878],
    overview: "Wade Wilson yang lesu bekerja keras dalam kehidupan sipil setelah masa-masanya sebagai pahlawan super Deadpool berakhir. Namun ketika dunia terancam, ia harus kembali beraksi bersama Wolverine."
  },
  {
    id: 1022789,
    title: "Inside Out 2",
    release_date: "2024-06-11",
    vote_average: 7.6,
    vote_count: 4900,
    poster_path: "/vpnVM9B6NMmQpWeZvzLvDESb2QY.jpg",
    backdrop_path: "/p5ozvmdgsmbWe0H8Xk7uOunRJum.jpg",
    genre_ids: [16, 10751, 35, 12],
    overview: "Kembali ke dalam benak Riley yang kini menginjak masa remaja. Ruang kendali emosi mengalami pembongkaran mendadak untuk menyambut tamu-tamu baru yang tak terduga: Anxiety, Envy, Ennui, dan Embarrassment."
  },
  {
    id: 519182,
    title: "Despicable Me 4",
    release_date: "2024-06-20",
    vote_average: 7.1,
    vote_count: 2400,
    poster_path: "/wWba3TaojhK7NdycRhoQpsG0FaH.jpg",
    backdrop_path: "/lgkGlOTIr9a4bmjYIugx0mNXAsk.jpg",
    genre_ids: [16, 10751, 35, 28],
    overview: "Gru dan Lucy bersama anak-anak mereka menyambut anggota baru dalam keluarga: Gru Jr., yang berniat menyiksa ayahnya, saat musuh baru Maxime Le Mal melarikan diri dari penjara."
  },
  {
    id: 693134,
    title: "Dune: Part Two",
    release_date: "2024-02-27",
    vote_average: 8.2,
    vote_count: 6100,
    poster_path: "/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg",
    backdrop_path: "/xOMo8BRK7PfcJv9JCnx7s520fr.jpg",
    genre_ids: [878, 12, 18],
    overview: "Paul Atreides bersatu dengan Chani dan suku Fremen sambil membalas dendam terhadap para konspirator yang menghancurkan keluarganya di planet gurun Arrakis."
  },
  {
    id: 573435,
    title: "Bad Boys: Ride or Die",
    release_date: "2024-06-05",
    vote_average: 7.5,
    vote_count: 2600,
    poster_path: "/nP6RliHjxsz4irTKsxe8FRhKZYl.jpg",
    backdrop_path: "/gKkl37BQuKTanygYQG1pyYgLVgf.jpg",
    genre_ids: [28, 35, 80],
    overview: "Detektif favorit Miami kini berstatus buronan ketika mereka terjerat konspirasi dan berusaha membersihkan nama mendiang kapten mereka."
  },
  {
    id: 823464,
    title: "Godzilla x Kong: The New Empire",
    release_date: "2024-03-27",
    vote_average: 7.2,
    vote_count: 3800,
    poster_path: "/z1p34vh7dEOnLDmyCrlUVLuoDzd.jpg",
    backdrop_path: "/qrGtVFxaD8c7et0j3sjYgyu0BTq.jpg",
    genre_ids: [28, 878, 12],
    overview: "Dua raksasa kuno, Godzilla dan Kong, harus bersatu melawan ancaman raksasa yang belum pernah ditemukan di dalam inti bumi yang dapat memusnahkan peradaban manusia."
  },
  {
    id: 748783,
    title: "The Garfield Movie",
    release_date: "2024-04-30",
    vote_average: 7.0,
    vote_count: 1200,
    poster_path: "/xYduFGuch9Cr16w95RJapwm97y.jpg",
    backdrop_path: "/vblTCXOWUQGSc83WJNxsnDeskW2.jpg",
    genre_ids: [16, 35, 10751],
    overview: "Garfield, kucing rumahan pecinta lasagna yang membenci hari Senin, terpaksa berpetualang di alam liar setelah bertemu kembali dengan ayahnya yang telah lama hilang."
  },
  {
    id: 976573,
    title: "Elemental",
    release_date: "2023-06-14",
    vote_average: 7.6,
    vote_count: 4200,
    poster_path: "/4Y1WNkd88JXmGfhtWR7dmDAo1T2.jpg",
    backdrop_path: "/jZIYaISP3GBSrVOPfrp98kpH8rL.jpg",
    genre_ids: [16, 35, 10749, 14],
    overview: "Di sebuah kota di mana penghuni api, air, tanah, dan udara hidup bersama, seorang wanita muda yang berapi-api dan seorang pemuda yang santai menemukan kesamaan luar biasa."
  },
  {
    id: 872585,
    title: "Oppenheimer",
    release_date: "2023-07-19",
    vote_average: 8.1,
    vote_count: 9100,
    poster_path: "/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg",
    backdrop_path: "/fm6KqXpk3M2HVveHwCrBSSBaO0V.jpg",
    genre_ids: [18, 36],
    overview: "Kisah fisikawan J. Robert Oppenheimer yang memimpin Proyek Manhattan untuk menciptakan bom atom pertama dalam sejarah umat manusia."
  },
  {
    id: 346698,
    title: "Barbie",
    release_date: "2023-07-19",
    vote_average: 7.1,
    vote_count: 8800,
    poster_path: "/iuFNMS8U5cb6xfzi51Dbkovj7vM.jpg",
    backdrop_path: "/ctMserH8g2SeOAnCw5gFjdQF8mo.jpg",
    genre_ids: [35, 12],
    overview: "Hidup di Barbieland berarti menjadi makhluk sempurna di tempat yang sempurna. Kecuali jika Anda mengalami krisis eksistensial total atau Anda adalah Ken."
  },
  {
    id: 569094,
    title: "Spider-Man: Across the Spider-Verse",
    release_date: "2023-05-31",
    vote_average: 8.4,
    vote_count: 7300,
    poster_path: "/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg",
    backdrop_path: "/4HodYYKEIsGOdinkGi2Ucz6X9i0.jpg",
    genre_ids: [16, 28, 12, 878],
    overview: "Miles Morales terlempar melintasi Multiverse, di mana ia bertemu dengan tim Spider-People yang bertugas melindungi keberadaannya. Namun sebuah ancaman baru memaksanya mempertanyakan arti menjadi pahlawan."
  }
];

// Fallback Poster SVG (Base64 Data URL for 100% reliable image loading without quote collision)
const FALLBACK_POSTER_SVG = 'data:image/svg+xml;base64,' + (typeof btoa !== 'undefined' ? btoa('<svg xmlns="http://www.w3.org/2000/svg" width="300" height="450" viewBox="0 0 300 450"><rect width="300" height="450" fill="#171717"/><rect x="10" y="10" width="280" height="430" rx="12" fill="#FFF8E8" stroke="#FFD34F" stroke-width="4"/><circle cx="150" cy="180" r="50" fill="#F18BDD" stroke="#171717" stroke-width="3"/><polygon points="142,160 168,180 142,200" fill="#171717"/><text x="150" y="270" font-family="sans-serif" font-size="20" font-weight="bold" fill="#171717" text-anchor="middle">FLIPPLAY CINEMA</text><text x="150" y="300" font-family="sans-serif" font-size="14" fill="#666" text-anchor="middle">Poster Belum Tersedia</text></svg>') : '');


// ==========================================
// 2. API SERVICE (TMDB)
// ==========================================
const MovieService = {
  /**
   * Fetch popular movies (used for 8 recommendations on homepage)
   */
  async getPopularMovies(page = 1) {
    try {
      const url = `${CONFIG.API_BASE_URL}/movie/popular?api_key=${CONFIG.API_KEY}&language=${CONFIG.DEFAULT_LANGUAGE}&page=${page}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      return {
        results: data.results || [],
        totalPages: data.total_pages || 1,
        totalResults: data.total_results || data.results.length
      };
    } catch (error) {
      console.warn('API live fetch failed, using fallback data:', error);
      return {
        results: FALLBACK_MOVIES,
        totalPages: 2,
        totalResults: FALLBACK_MOVIES.length
      };
    }
  },

  /**
   * Search movies by title query
   */
  async searchMovies(query, page = 1) {
    if (!query || query.trim() === '') {
      return this.getPopularMovies(page);
    }
    try {
      const encoded = encodeURIComponent(query.trim());
      const url = `${CONFIG.API_BASE_URL}/search/movie?api_key=${CONFIG.API_KEY}&language=${CONFIG.DEFAULT_LANGUAGE}&query=${encoded}&page=${page}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      return {
        results: data.results || [],
        totalPages: data.total_pages || 1,
        totalResults: data.total_results || data.results.length
      };
    } catch (error) {
      console.warn('API search failed, filtering local fallback:', error);
      const q = query.toLowerCase();
      const filtered = FALLBACK_MOVIES.filter(m => m.title.toLowerCase().includes(q));
      return {
        results: filtered,
        totalPages: 1,
        totalResults: filtered.length
      };
    }
  },

  /**
   * Discover movies by genre ID
   */
  async getMoviesByGenre(genreId, page = 1) {
    if (!genreId) {
      return this.getPopularMovies(page);
    }
    try {
      const url = `${CONFIG.API_BASE_URL}/discover/movie?api_key=${CONFIG.API_KEY}&language=${CONFIG.DEFAULT_LANGUAGE}&with_genres=${genreId}&sort_by=popularity.desc&page=${page}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      return {
        results: data.results || [],
        totalPages: data.total_pages || 1,
        totalResults: data.total_results || data.results.length
      };
    } catch (error) {
      console.warn('API genre fetch failed, filtering local fallback:', error);
      const filtered = FALLBACK_MOVIES.filter(m => (m.genre_ids || []).includes(Number(genreId)));
      return {
        results: filtered,
        totalPages: 1,
        totalResults: filtered.length
      };
    }
  },

  /**
   * Get single movie details for modal popup
   */
  async getMovieDetails(movieId) {
    try {
      const url = `${CONFIG.API_BASE_URL}/movie/${movieId}?api_key=${CONFIG.API_KEY}&language=${CONFIG.DEFAULT_LANGUAGE}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.warn('API movie details failed, using cached item:', error);
      const local = FALLBACK_MOVIES.find(m => m.id === Number(movieId));
      if (local) return local;
      throw error;
    }
  }
};

// ==========================================
// 3. UI RENDERING UTILITIES
// ==========================================
const UI = {
  /**
   * Get full poster image URL with fallback error handling
   */
  getPosterUrl(path) {
    if (!path) return FALLBACK_POSTER_SVG;
    return `${CONFIG.IMAGE_BASE_URL}${path}`;
  },

  /**
   * Get backdrop URL
   */
  getBackdropUrl(path) {
    if (!path) return FALLBACK_POSTER_SVG;
    return `${CONFIG.BACKDROP_BASE_URL}${path}`;
  },

  /**
   * Get primary genre name from genre_ids
   */
  getPrimaryGenre(genreIds) {
    if (!genreIds || genreIds.length === 0) return 'Sinema';
    const firstId = genreIds[0];
    return GENRES[firstId] || 'Sinema';
  },

  /**
   * Extract release year from "YYYY-MM-DD"
   */
  getYear(dateString) {
    if (!dateString) return '2024';
    return dateString.split('-')[0] || '2024';
  },

  /**
   * Format rating to 1 decimal place
   */
  formatRating(voteAverage) {
    if (!voteAverage || voteAverage === 0) return 'NR';
    return Number(voteAverage).toFixed(1);
  },

  /**
   * Render single movie card HTML (Neo-Brutalist Super Hello style)
   */
  renderMovieCard(movie) {
    const posterUrl = this.getPosterUrl(movie.poster_path);
    const year = this.getYear(movie.release_date);
    const rating = this.formatRating(movie.vote_average);
    const genre = this.getPrimaryGenre(movie.genre_ids || (movie.genres ? movie.genres.map(g => g.id) : []));
    const titleEscaped = this.escapeHtml(movie.title);

    return `
      <article class="movie-card" data-movie-id="${movie.id}">
        <div class="movie-poster-box">
          <img 
            src="${posterUrl}" 
            alt="Poster film ${titleEscaped}"
            class="movie-poster-img"
            loading="lazy"
            onerror="this.onerror=null; this.src='${FALLBACK_POSTER_SVG}';"
          />
          <span class="poster-rating-badge" title="Skor rating penonton">
            ★ ${rating}
          </span>
          <span class="poster-year-badge">
            ${year}
          </span>
        </div>

        <div class="movie-card-body">
          <div>
            <div class="movie-card-meta">
              <span class="movie-genre-chip">${genre}</span>
            </div>
            <h3 class="movie-card-title" title="${titleEscaped}">
              ${titleEscaped}
            </h3>
          </div>

          <div class="movie-card-action">
            <button 
              type="button" 
              class="btn-detail js-view-detail" 
              data-id="${movie.id}"
              aria-label="Lihat detail film ${titleEscaped}">
              <span>🎬 Lihat Detail</span>
              <span class="btn-icon-arrow" aria-hidden="true">&rarr;</span>
            </button>
          </div>
        </div>
      </article>
    `;
  },

  escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }
};

// ==========================================
// 4. MODAL DETAIL CONTROLLER
// ==========================================
const ModalController = {
  backdrop: null,
  container: null,
  closeBtn: null,
  activeMovie: null,

  init() {
    this.backdrop = document.getElementById('movieModalBackdrop');
    if (!this.backdrop) return;

    this.closeBtn = document.getElementById('modalCloseBtn');
    if (this.closeBtn) {
      this.closeBtn.addEventListener('click', () => this.close());
    }

    // Close when clicking outside modal content
    this.backdrop.addEventListener('click', (e) => {
      if (e.target === this.backdrop) {
        this.close();
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.backdrop.classList.contains('open')) {
        this.close();
      }
    });

    // Global listener for detail buttons
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('.js-view-detail');
      if (btn) {
        const movieId = btn.getAttribute('data-id');
        if (movieId) {
          this.open(movieId);
        }
      }
    });
  },

  async open(movieId) {
    if (!this.backdrop) return;
    this.backdrop.classList.add('open');
    document.body.style.overflow = 'hidden';

    const bannerImg = document.getElementById('modalBannerImg');
    const posterImg = document.getElementById('modalPosterImg');
    const titleEl = document.getElementById('modalMovieTitle');
    const yearEl = document.getElementById('modalYear');
    const ratingEl = document.getElementById('modalRating');
    const genresEl = document.getElementById('modalGenres');
    const overviewEl = document.getElementById('modalOverview');

    // Loading state in modal
    if (titleEl) titleEl.textContent = 'Memuat informasi film...';
    if (overviewEl) overviewEl.textContent = 'Mohon tunggu sebentar...';

    try {
      const movie = await MovieService.getMovieDetails(movieId);
      this.activeMovie = movie;

      const title = movie.title || 'Judul Film';
      const year = UI.getYear(movie.release_date);
      const rating = UI.formatRating(movie.vote_average);
      const voteCount = movie.vote_count ? `(${movie.vote_count.toLocaleString()} suara)` : '';
      const overview = movie.overview && movie.overview.trim() !== ''
        ? movie.overview
        : 'Sinopsis untuk film ini belum tersedia dalam bahasa ini.';

      if (titleEl) titleEl.textContent = title;
      if (yearEl) yearEl.textContent = `Tahun: ${year}`;
      if (ratingEl) ratingEl.innerHTML = `★ <strong>${rating}</strong> ${voteCount}`;
      if (overviewEl) overviewEl.textContent = overview;

      if (posterImg) {
        posterImg.src = UI.getPosterUrl(movie.poster_path);
        posterImg.alt = `Poster ${title}`;
        posterImg.onerror = () => { posterImg.src = FALLBACK_POSTER_SVG; };
      }

      if (bannerImg) {
        bannerImg.src = UI.getBackdropUrl(movie.backdrop_path || movie.poster_path);
        bannerImg.onerror = () => { bannerImg.src = FALLBACK_POSTER_SVG; };
      }

      // Populate genres
      if (genresEl) {
        let genreNames = [];
        if (movie.genres && movie.genres.length > 0) {
          genreNames = movie.genres.map(g => g.name);
        } else if (movie.genre_ids) {
          genreNames = movie.genre_ids.map(id => GENRES[id]).filter(Boolean);
        }
        if (genreNames.length === 0) genreNames = ['Film Umum'];

        genresEl.innerHTML = genreNames.map(name => `
          <span class="badge-sticker" style="background-color: var(--color-yellow); border-width: 2px;">
            ${name}
          </span>
        `).join('');
      }

    } catch (error) {
      console.error('Gagal memuat detail film:', error);
      if (titleEl) titleEl.textContent = 'Gagal memuat detail film';
      if (overviewEl) overviewEl.textContent = 'Terjadi kendala saat menghubungi server TMDB. Silakan periksa koneksi internet Anda.';
    }
  },

  close() {
    if (!this.backdrop) return;
    this.backdrop.classList.remove('open');
    document.body.style.overflow = '';
  }
};

// ==========================================
// 5. HOMEPAGE LOGIC
// ==========================================
const HomePage = {
  async init() {
    const recommendationsGrid = document.getElementById('recommendationsGrid');
    if (!recommendationsGrid) return;

    // Show initial loading state
    recommendationsGrid.innerHTML = `
      <div class="state-box">
        <div class="spinner"></div>
        <h3 class="font-display text-xl">Mengambil 8 Rekomendasi Film Terbaru...</h3>
        <p class="text-sm mt-2">Menghubungkan ke API film TMDB...</p>
      </div>
    `;

    try {
      const data = await MovieService.getPopularMovies(1);
      // Take EXACTLY 8 movies as required by specification
      const movies = (data.results || []).slice(0, 8);

      if (movies.length === 0) {
        recommendationsGrid.innerHTML = `
          <div class="state-box">
            <h3>Belum ada rekomendasi yang tersedia saat ini.</h3>
          </div>
        `;
        return;
      }

      recommendationsGrid.innerHTML = movies.map(movie => UI.renderMovieCard(movie)).join('');

      // Optionally update hero featured card with the #1 movie if available
      this.updateHeroFeatured(movies[0]);

    } catch (error) {
      console.error('Error fetching recommendations:', error);
      recommendationsGrid.innerHTML = `
        <div class="state-box" style="border-color: var(--color-red);">
          <h3 style="color: var(--color-red);">Gagal Memuat Film dari API</h3>
          <p class="mt-2 text-sm">Silakan periksa koneksi internet Anda atau muat ulang halaman.</p>
          <button type="button" class="btn btn-yellow btn-sm mt-4" onclick="HomePage.init()">Coba Lagi</button>
        </div>
      `;
    }
  },

  updateHeroFeatured(movie) {
    if (!movie) return;
    const heroPoster = document.getElementById('heroCardPosterImg');
    const heroTitle = document.getElementById('heroCardTitle');
    const heroMeta = document.getElementById('heroCardMeta');
    const heroBtn = document.getElementById('heroCardBtn');

    if (heroPoster) {
      heroPoster.src = UI.getBackdropUrl(movie.backdrop_path || movie.poster_path);
      heroPoster.onerror = () => { heroPoster.src = FALLBACK_POSTER_SVG; };
    }
    if (heroTitle) heroTitle.textContent = movie.title;
    if (heroMeta) {
      const year = UI.getYear(movie.release_date);
      const rating = UI.formatRating(movie.vote_average);
      heroMeta.textContent = `${year} • Rating ★ ${rating} • Pilihan Editor`;
    }
    if (heroBtn) {
      heroBtn.setAttribute('data-id', movie.id);
    }
  }
};

// ==========================================
// 6. CATALOG PAGE LOGIC (MOVIES.HTML)
// ==========================================
const CatalogPage = {
  catalogGrid: null,
  searchInput: null,
  searchBtn: null,
  genreContainer: null,
  statsLabel: null,
  loadMoreBtn: null,
  resetFilterBtn: null,

  // State
  currentQuery: '',
  currentGenreId: '', // '' means all
  currentPage: 1,
  totalPages: 1,
  isLoading: false,
  loadedMovies: [],
  debounceTimer: null,

  init() {
    this.catalogGrid = document.getElementById('catalogGrid');
    if (!this.catalogGrid) return; // Not on catalog page

    this.searchInput = document.getElementById('catalogSearchInput');
    this.searchBtn = document.getElementById('catalogSearchBtn');
    this.genreContainer = document.getElementById('genreChipsContainer');
    this.statsLabel = document.getElementById('catalogStatsText');
    this.loadMoreBtn = document.getElementById('btnLoadMore');
    this.resetFilterBtn = document.getElementById('btnResetFilter');

    // Attach search events
    if (this.searchInput) {
      this.searchInput.addEventListener('input', (e) => {
        clearTimeout(this.debounceTimer);
        this.debounceTimer = setTimeout(() => {
          this.currentQuery = e.target.value.trim();
          this.resetAndFetch();
        }, 380);
      });

      this.searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          clearTimeout(this.debounceTimer);
          this.currentQuery = this.searchInput.value.trim();
          this.resetAndFetch();
        }
      });
    }

    if (this.searchBtn) {
      this.searchBtn.addEventListener('click', () => {
        if (this.searchInput) {
          this.currentQuery = this.searchInput.value.trim();
          this.resetAndFetch();
        }
      });
    }

    // Attach genre filter chips
    if (this.genreContainer) {
      this.genreContainer.addEventListener('click', (e) => {
        const chip = e.target.closest('.genre-chip-btn');
        if (!chip) return;

        const genreId = chip.getAttribute('data-genre-id') || '';
        if (this.currentGenreId === genreId) return; // already active

        // Update active class
        this.genreContainer.querySelectorAll('.genre-chip-btn').forEach(btn => {
          btn.classList.remove('active');
        });
        chip.classList.add('active');

        this.currentGenreId = genreId;
        this.resetAndFetch();
      });
    }

    // Attach reset filter button
    if (this.resetFilterBtn) {
      this.resetFilterBtn.addEventListener('click', () => {
        this.resetAllFilters();
      });
    }

    // Attach load more button
    if (this.loadMoreBtn) {
      this.loadMoreBtn.addEventListener('click', () => {
        if (!this.isLoading && this.currentPage < this.totalPages) {
          this.fetchNextPage();
        }
      });
    }

    // Check URL parameters (e.g. ?genre=28 or ?search=avatar)
    const params = new URLSearchParams(window.location.search);
    if (params.has('genre')) {
      this.currentGenreId = params.get('genre');
      const targetChip = this.genreContainer?.querySelector(`[data-genre-id="${this.currentGenreId}"]`);
      if (targetChip) {
        this.genreContainer.querySelectorAll('.genre-chip-btn').forEach(b => b.classList.remove('active'));
        targetChip.classList.add('active');
      }
    }
    if (params.has('search')) {
      this.currentQuery = params.get('search');
      if (this.searchInput) this.searchInput.value = this.currentQuery;
    }

    // Initial load
    this.resetAndFetch();
  },

  resetAllFilters() {
    this.currentQuery = '';
    this.currentGenreId = '';
    if (this.searchInput) this.searchInput.value = '';
    if (this.genreContainer) {
      this.genreContainer.querySelectorAll('.genre-chip-btn').forEach(b => {
        b.classList.remove('active');
        if (b.getAttribute('data-genre-id') === '') b.classList.add('active');
      });
    }
    this.resetAndFetch();
  },

  resetAndFetch() {
    this.currentPage = 1;
    this.loadedMovies = [];
    this.fetchMovies(false);
  },

  async fetchNextPage() {
    this.currentPage += 1;
    this.fetchMovies(true);
  },

  async fetchMovies(isAppending = false) {
    if (this.isLoading) return;
    this.isLoading = true;

    if (!isAppending) {
      this.catalogGrid.innerHTML = `
        <div class="state-box">
          <div class="spinner"></div>
          <h3 class="font-display text-xl">Menjelajahi Katalog Film...</h3>
          <p class="text-sm mt-2">Mengambil data film dari API...</p>
        </div>
      `;
    }

    if (this.loadMoreBtn) {
      this.loadMoreBtn.textContent = 'Memuat...';
      this.loadMoreBtn.disabled = true;
    }

    try {
      let data;
      // Combine Search & Genre Filtering
      if (this.currentQuery) {
        data = await MovieService.searchMovies(this.currentQuery, this.currentPage);
      } else if (this.currentGenreId) {
        data = await MovieService.getMoviesByGenre(this.currentGenreId, this.currentPage);
      } else {
        data = await MovieService.getPopularMovies(this.currentPage);
      }

      let newResults = data.results || [];

      // If user provided BOTH search query AND a specific genre filter,
      // apply client-side genre filtering on search results:
      if (this.currentQuery && this.currentGenreId) {
        const targetId = Number(this.currentGenreId);
        newResults = newResults.filter(movie => {
          return (movie.genre_ids || []).includes(targetId);
        });
      }

      this.totalPages = data.totalPages || 1;

      // Filter out duplicate IDs to ensure completely unique items
      const existingIds = new Set(this.loadedMovies.map(m => m.id));
      const uniqueNewMovies = newResults.filter(m => !existingIds.has(m.id));

      if (isAppending) {
        this.loadedMovies = [...this.loadedMovies, ...uniqueNewMovies];
      } else {
        this.loadedMovies = uniqueNewMovies;
      }

      this.renderCatalogResults();

    } catch (error) {
      console.error('Error fetching catalog movies:', error);
      this.catalogGrid.innerHTML = `
        <div class="state-box" style="border-color: var(--color-red);">
          <h3 style="color: var(--color-red);">Terjadi Kesalahan Saat Mengambil Data</h3>
          <p class="mt-2 text-sm">Gagal menghubungkan ke server film. Silakan coba kembali.</p>
          <button type="button" class="btn btn-yellow btn-sm mt-4" onclick="CatalogPage.resetAndFetch()">Muat Ulang</button>
        </div>
      `;
    } finally {
      this.isLoading = false;
      if (this.loadMoreBtn) {
        this.loadMoreBtn.textContent = 'Muat Lebih Banyak Film ↓';
        this.loadMoreBtn.disabled = false;
      }
    }
  },

  renderCatalogResults() {
    // Empty state
    if (this.loadedMovies.length === 0) {
      const activeGenreName = this.currentGenreId ? (GENRES[this.currentGenreId] || 'Genre terpilih') : '';
      this.catalogGrid.innerHTML = `
        <div class="state-box">
          <div style="font-size: 3rem; margin-bottom: 0.5rem;" aria-hidden="true">🎬🔍</div>
          <h3 class="font-display text-2xl">Tidak Ada Film Ditemukan</h3>
          <p class="mt-2 text-sm" style="max-width: 480px; margin: 0.5rem auto 1.5rem auto;">
            Tidak ada film yang cocok dengan pencarian <strong>"${UI.escapeHtml(this.currentQuery)}"</strong>
            ${activeGenreName ? `pada genre <strong>${activeGenreName}</strong>` : ''}.
            Coba gunakan kata kunci lain atau bersihkan filter.
          </p>
          <button type="button" class="btn btn-yellow btn-sm" onclick="CatalogPage.resetAllFilters()">
            Hapus Semua Filter
          </button>
        </div>
      `;
      this.updateStats(0);
      if (this.loadMoreBtn) this.loadMoreBtn.style.display = 'none';
      return;
    }

    // Render cards
    this.catalogGrid.innerHTML = this.loadedMovies.map(movie => UI.renderMovieCard(movie)).join('');
    this.updateStats(this.loadedMovies.length);

    // Manage Load More button visibility
    if (this.loadMoreBtn) {
      if (this.currentPage >= this.totalPages || this.currentQuery) {
        // If reached end or on custom search filter
        this.loadMoreBtn.style.display = this.currentPage < this.totalPages ? 'inline-flex' : 'none';
      } else {
        this.loadMoreBtn.style.display = 'inline-flex';
      }
    }
  },

  updateStats(count) {
    if (!this.statsLabel) return;
    let text = `Menampilkan ${count} film`;
    if (this.currentQuery) {
      text += ` untuk kata kunci "${UI.escapeHtml(this.currentQuery)}"`;
    }
    if (this.currentGenreId && GENRES[this.currentGenreId]) {
      text += ` • Genre: ${GENRES[this.currentGenreId]}`;
    }
    this.statsLabel.textContent = text;
  }
};

// ==========================================
// 7. CONTACT FORM CONTROLLER
// ==========================================
const ContactFormController = {
  init() {
    const form = document.getElementById('contactMovieForm');
    const toast = document.getElementById('formToastNotice');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('nama');
      const emailInput = document.getElementById('email');
      const messageInput = document.getElementById('pesan');

      const name = nameInput ? nameInput.value.trim() : '';
      const email = emailInput ? emailInput.value.trim() : '';
      const message = messageInput ? messageInput.value.trim() : '';

      // Validation
      if (!name || !email || !message) {
        alert('Harap isi semua kolom formulir dengan benar.');
        return;
      }

      // Simple email pattern check
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        alert('Format email tidak valid. Mohon periksa kembali.');
        return;
      }

      // Explicitly honest notification as mandated by project requirements:
      // "Jangan mengklaim pesan telah terkirim ke server apabila belum ada backend atau layanan pengiriman yang benar-benar terhubung."
      if (toast) {
        toast.innerHTML = `
          <div style="display: flex; align-items: flex-start; gap: 0.75rem;">
            <span style="font-size: 1.5rem;" aria-hidden="true">💌</span>
            <div>
              <strong style="display: block; font-size: 1rem; color: var(--color-charcoal);">
                Terima kasih, ${UI.escapeHtml(name)}!
              </strong>
              <p style="margin-top: 0.25rem; font-size: 0.875rem; color: rgba(23,23,23,0.85);">
                Pesan saran film Anda telah berhasil dicatat pada antarmuka (mode demo frontend). Kami sangat menghargai kontribusi ide film Anda!
              </p>
            </div>
          </div>
        `;
        toast.classList.add('show');
        form.reset();

        setTimeout(() => {
          toast.classList.remove('show');
        }, 8000);
      }
    });
  }
};

// ==========================================
// 8. MOBILE DRAWER NAVIGATION
// ==========================================
const NavigationController = {
  init() {
    const toggleBtn = document.getElementById('mobileMenuToggle');
    const mobileNav = document.getElementById('mobileNavDrawer');
    if (!toggleBtn || !mobileNav) return;

    toggleBtn.addEventListener('click', () => {
      const isOpen = mobileNav.classList.toggle('open');
      toggleBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    // Close when clicking any nav link in mobile menu
    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileNav.classList.remove('open');
        toggleBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }
};

// ==========================================
// 8.5. RETRO MUSIC PLAYER CONTROLLER
// (Persists playback across page navigations via sessionStorage)
// ==========================================
const MusicPlayerController = {
  tracks: [
    {
      title: "Eenie Meenie x Beauty and a Beat",
      file: "music/EENIE MEENIE x BEAUTY AND A BEAT x WE FOUND LOVE  MASHUP - LUCAS HAZEN.mp3"
    },
    {
      title: "Make It To The Morning",
      file: "music/PARTYNEXTDOOR - MAKE IT TO THE MORNING (Lyric Video) - PARTYNEXTDOOR.mp3"
    },
    {
      title: "Play Hard x No Broke Boys",
      file: "music/Play Hard x No Broke Boys – David Guetta ft. Ne-Yo & Akon x Disco Lines & Tinashe (DEVANK MASHUP) - Devank°.mp3"
    },
    {
      title: "She Bugging x New Jeans",
      file: "music/She Bugging x New Jeans (Best TikTok Version).mp3"
    },
    {
      title: "Coming Down x Hotline Bling",
      file: "music/coming down × hotline bling (tiktok version) - 𝗩𝗜𝗕𝗘𝝠𝗨𝗗𝗜𝝝𝗭𝗭..mp3"
    },
    {
      title: "WYW My Sweetie (Slowed)",
      file: "music/wyw my sweetie, jersey club but slowed tiktok version - only zynx's.mp3"
    }
  ],
  currentIndex: 0,
  audio: null,
  isPlaying: false,
  _isPageNavigation: false,

  init() {
    // Detect if this is a page refresh vs a navigation between pages.
    // On refresh we want music to stop; on navigation we want it to continue.
    const isRefresh = this._detectRefresh();

    if (isRefresh) {
      // Clear saved music state on refresh so music doesn't auto-resume
      sessionStorage.removeItem('flipplay_music_state');
    }

    // Find player element - could be the main one or any player on the page
    const playerEl = document.getElementById('retroAudioPlayer');

    this.audio = new Audio();
    this.audio.preload = 'metadata';

    // Restore saved state from sessionStorage (only if not a refresh)
    const savedState = this._restoreState();
    if (savedState) {
      this.currentIndex = savedState.trackIndex;
    }

    this.updateTrackInfo();

    // Bind controls from all possible player elements on the page
    this._bindPlayerControls('retroAudioPlayer');
    this._bindPlayerControls('retroAudioPlayerCatalog');

    // Auto next track when current ends
    this.audio.addEventListener('ended', () => {
      this.currentIndex = (this.currentIndex + 1) % this.tracks.length;
      this.updateTrackInfo();
      this.audio.play().catch(e => console.warn(e));
    });

    // Handle pause / play events
    this.audio.addEventListener('play', () => {
      this.isPlaying = true;
      this.updateUI();
    });
    this.audio.addEventListener('pause', () => {
      this.isPlaying = false;
      this.updateUI();
    });

    // If there was a saved state and music was playing, resume playback
    if (savedState && savedState.wasPlaying) {
      this.audio.addEventListener('loadedmetadata', () => {
        if (savedState.currentTime > 0) {
          this.audio.currentTime = savedState.currentTime;
        }
        this.audio.play().catch(e => console.warn('Auto-resume blocked by browser:', e));
      }, { once: true });
      // Trigger load to fire loadedmetadata
      this.audio.load();
    }

    // Save state before page unload (navigating away)
    window.addEventListener('beforeunload', () => {
      this._saveState();
    });

    // Mark link clicks as navigation (not refresh) using a sessionStorage flag
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a[href]');
      if (link && !link.href.startsWith('javascript:') && !link.href.startsWith('#')) {
        // User is navigating to another page via link click
        sessionStorage.setItem('flipplay_is_navigating', 'true');
      }
    });
  },

  /**
   * Bind play/prev/next controls from a specific player element by ID
   */
  _bindPlayerControls(playerId) {
    const playerEl = document.getElementById(playerId);
    if (!playerEl) return;

    // Try ID-based buttons first (for the main hero player)
    const playBtnById = document.getElementById('audioPlayBtn');
    const prevBtnById = document.getElementById('audioPrevBtn');
    const nextBtnById = document.getElementById('audioNextBtn');

    // Also find buttons by class within this player (for secondary players)
    const playBtnByClass = playerEl.querySelector('.audio-play-btn, .audio-play-toggle-btn');
    const prevBtnByClass = playerEl.querySelector('.audio-prev-btn, .audio-step-btn:first-child');
    const nextBtnByClass = playerEl.querySelector('.audio-next-btn, .audio-step-btn:last-child');

    // Bind ID-based buttons only for the primary player
    if (playerId === 'retroAudioPlayer') {
      if (playBtnById) playBtnById.addEventListener('click', () => this.togglePlay());
      if (prevBtnById) prevBtnById.addEventListener('click', () => this.prevTrack());
      if (nextBtnById) nextBtnById.addEventListener('click', () => this.nextTrack());
    }

    // Bind class-based buttons for secondary players (avoid double-binding on primary)
    if (playerId !== 'retroAudioPlayer') {
      if (playBtnByClass) playBtnByClass.addEventListener('click', () => this.togglePlay());
      if (prevBtnByClass) prevBtnByClass.addEventListener('click', () => this.prevTrack());
      if (nextBtnByClass) nextBtnByClass.addEventListener('click', () => this.nextTrack());
    }
  },

  /**
   * Detect whether the current page load is a refresh or a navigation
   */
  _detectRefresh() {
    const isNavigating = sessionStorage.getItem('flipplay_is_navigating');
    if (isNavigating === 'true') {
      // This was a link-click navigation, clear the flag
      sessionStorage.removeItem('flipplay_is_navigating');
      return false; // Not a refresh
    }

    // Check Performance API for navigation type
    if (performance && performance.getEntriesByType) {
      const navEntries = performance.getEntriesByType('navigation');
      if (navEntries.length > 0 && navEntries[0].type === 'reload') {
        return true; // Actual page refresh
      }
    }

    // Fallback: if there's no navigation flag and no saved state, treat as fresh load
    const hasState = sessionStorage.getItem('flipplay_music_state');
    if (!hasState) {
      return true; // No prior state = fresh load or refresh
    }

    return false;
  },

  /**
   * Save current music state to sessionStorage
   */
  _saveState() {
    if (!this.audio) return;
    const state = {
      trackIndex: this.currentIndex,
      currentTime: this.audio.currentTime || 0,
      wasPlaying: this.isPlaying
    };
    try {
      sessionStorage.setItem('flipplay_music_state', JSON.stringify(state));
    } catch (e) {
      // sessionStorage might be full or unavailable
    }
  },

  /**
   * Restore music state from sessionStorage
   */
  _restoreState() {
    try {
      const raw = sessionStorage.getItem('flipplay_music_state');
      if (!raw) return null;
      return JSON.parse(raw);
    } catch (e) {
      return null;
    }
  },

  updateTrackInfo() {
    const track = this.tracks[this.currentIndex];
    if (!track) return;

    this.audio.src = encodeURI(track.file);

    // Update track title in all player instances on the page
    const titleEl = document.getElementById('audioTrackTitle');
    if (titleEl) {
      titleEl.textContent = `${this.currentIndex + 1}/${this.tracks.length}: ${track.title}`;
    }

    // Update title in catalog player too (by class)
    document.querySelectorAll('.audio-title-text').forEach(el => {
      el.textContent = `${this.currentIndex + 1}/${this.tracks.length}: ${track.title}`;
    });
  },

  async togglePlay() {
    if (!this.audio) return;
    try {
      if (this.isPlaying) {
        this.audio.pause();
      } else {
        await this.audio.play();
      }
    } catch (e) {
      console.warn('Playback error:', e);
    }
  },

  nextTrack() {
    this.currentIndex = (this.currentIndex + 1) % this.tracks.length;
    this.updateTrackInfo();
    if (this.isPlaying) {
      this.audio.play().catch(e => console.warn(e));
    }
    this.saveState();
  },

  prevTrack() {
    this.currentIndex = (this.currentIndex - 1 + this.tracks.length) % this.tracks.length;
    this.updateTrackInfo();
    if (this.isPlaying) {
      this.audio.play().catch(e => console.warn(e));
    }
    this.saveState();
  },

  updateUI() {
    // Update all player elements on the page
    const playerIds = ['retroAudioPlayer', 'retroAudioPlayerCatalog'];
    playerIds.forEach(id => {
      const playerEl = document.getElementById(id);
      if (playerEl) {
        if (this.isPlaying) {
          playerEl.classList.add('playing');
        } else {
          playerEl.classList.remove('playing');
        }
      }
    });

    // Update all play icons
    const playIcon = document.getElementById('audioPlayIcon');
    if (playIcon) {
      playIcon.textContent = this.isPlaying ? '⏸' : '▶';
    }
    document.querySelectorAll('.audio-play-icon').forEach(el => {
      el.textContent = this.isPlaying ? '⏸' : '▶';
    });
  }
};

// ==========================================
// 9. APP BOOTSTRAP
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  NavigationController.init();
  ModalController.init();
  HomePage.init();
  CatalogPage.init();
  ContactFormController.init();
  MusicPlayerController.init();
});

