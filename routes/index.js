import { Router } from 'express';
import * as authService from '../services/auth.js';
import * as aiService from '../services/ai.js';
import * as gameService from '../services/crud.js';

const router = Router();
const asyncHandler = (handler) => (req, res, next) => {
  Promise.resolve(handler(req, res, next)).catch(next);
};

router.use((req, res, next) => {
  res.locals.activePage = '';
  next();
});

router.get('/', (req, res) => {
  res.render('games/index', { title: 'Quản lý game', activePage: 'home' });
});

router.get('/game/new', asyncHandler(async (req, res) => {
  const categories = await gameService.getAllCategories();
  res.render('games/form', { title: 'Thêm game', game: null, categories, activePage: 'new' });
}));

router.get('/game/:id', (req, res) => {
  res.render('games/detail', {
    title: 'Chi tiết game',
    gameId: req.params.id,
    activePage: 'home',
  });
});

router.get('/game/:id/edit', asyncHandler(async (req, res) => {
  const game = await gameService.getGameById(req.params.id);
  const categories = await gameService.getAllCategories();
  res.render('games/form', { title: 'Chỉnh sửa game', game, categories, activePage: 'new' });
}));

router.get('/login', (req, res) => {
  res.render('auth', { title: 'Đăng nhập', mode: 'login' });
});

router.get('/register', (req, res) => {
  res.render('auth', { title: 'Tạo tài khoản', mode: 'register' });
});

router.post('/api/auth/login', asyncHandler(async (req, res) => {
  res.json(await authService.login(req.body));
}));

router.post('/api/auth/register', asyncHandler(async (req, res) => {
  const response = await authService.register(req.body);
  res.status(201).json(response);
}));

const requireAuth = (req, res, next) => {
  if (!req.get('authorization')?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Vui lòng đăng nhập để tiếp tục.' });
  }
  next();
};

router.get('/ai', (req, res) => {
  res.render('games/ai', { title: 'Trợ lý AI CRUD', activePage: 'assistant' });
});

router.post('/api/ai/command', requireAuth, asyncHandler(async (req, res) => {
  const { command } = req.body;
  if (typeof command !== 'string' || !command.trim()) {
    return res.status(400).json({ error: 'Vui lòng nhập yêu cầu.' });
  }
  const history = Array.isArray(req.body.history)
    ? req.body.history
      .filter((message) => ['user', 'assistant'].includes(message?.role) && typeof message.text === 'string')
      .slice(-6)
      .map(({ role, text }) => ({ role, text: text.slice(0, 700) }))
    : [];
  res.json(await aiService.runCommand(command, req.get('authorization'), history));
}));

router.use('/api/categories', requireAuth);

router.get('/api/categories', asyncHandler(async (req, res) => {
  const categories = await gameService.getAllCategories(req.get('authorization'));
  res.json(categories);
}));

router.use('/api/games', requireAuth);

router.get('/api/games', asyncHandler(async (req, res) => {
  const search = typeof req.query.search === 'string' ? req.query.search : '';
  const order = req.query.order === 'desc' ? 'desc' : 'asc';
  const requestedPage = Number.parseInt(req.query.page, 10);
  const page = Number.isInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1;
  const limit = 3;
  const result = await gameService.getAllGames(search, order, page, limit, req.get('authorization'));
  const totalPages = Math.ceil(result.total / limit);

  res.json({ ...result, page, limit, totalPages });
}));

router.get('/api/games/:id', asyncHandler(async (req, res) => {
  res.json(await gameService.getGameById(req.params.id, req.get('authorization')));
}));

router.post('/api/games', asyncHandler(async (req, res) => {
  const createdGame = await gameService.createGame(req.body, req.get('authorization'));
  const message = `Game "${createdGame.title}" đã được tạo thành công.`;
  res.status(201).json({ ...createdGame, message });
}));

router.patch('/api/games/:id', asyncHandler(async (req, res) => {
  const updatedGame = await gameService.updateGame(req.params.id, req.body, req.get('authorization'));
  const message = `Game "${updatedGame.title}" đã được cập nhật thành công.`;
  res.json({ ...updatedGame, message });
}));

router.delete('/api/games/:id', asyncHandler(async (req, res) => {
  await gameService.deleteGame(req.params.id, req.get('authorization'));
  res.status(204).end();
}));

router.use((req, res) => {
  if (req.path === '/api' || req.path.startsWith('/api/')) {
    return res.status(404).json({ error: 'Không tìm thấy API.' });
  }

  res.status(404).render('404', { title: 'Không tìm thấy trang' });
});

export default router;