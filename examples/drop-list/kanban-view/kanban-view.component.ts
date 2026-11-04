import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import {
  IDropEvent,
  NgxDraggable,
  NgxDropList,
  NgxDropListGroup,
  moveItemInArray,
  transferArrayItem,
} from 'ngx-kit/drag-resize';

/* ───────────────────────────── model ───────────────────────────── */

type Lang = 'en' | 'fa';
type Dir = 'ltr' | 'rtl';
type Theme = 'auto' | 'light' | 'dark';
type Priority = 'highest' | 'high' | 'medium' | 'low';
type TaskType = 'story' | 'bug' | 'task' | 'epic' | 'spike';
type L10n = Record<Lang, string>;

interface Person {
  id: string;
  name: L10n;
  initials: L10n;
  hue: number;
}

interface Label {
  text: L10n;
  hue: number;
}

interface Task {
  id: string;
  key: string;
  type: TaskType;
  priority: Priority;
  title: L10n;
  description?: L10n;
  assignees: string[];
  labels: string[];
  points?: number;
  subtasks?: { done: number; total: number };
  comments: number;
  attachments: number;
  due?: Date;
  blocked?: boolean;
}

interface Section {
  id: string;
  title: L10n;
  tasks: Task[];
  collapsed: boolean;
}

interface Column {
  id: string;
  title: L10n;
  hue: number;
  done?: boolean;
  wipLimit?: number;
  sections: Section[];
}

interface DueInfo {
  text: string;
  state: 'overdue' | 'soon' | 'ok';
}

/* ───────────────────────────── sample data ───────────────────────────── */

const PEOPLE: Person[] = [
  {
    id: 'sara',
    name: { en: 'Sara Lindqvist', fa: 'سارا رحیمی' },
    initials: { en: 'SL', fa: 'سر' },
    hue: 330,
  },
  {
    id: 'amir',
    name: { en: 'Amir Hosseini', fa: 'امیر حسینی' },
    initials: { en: 'AH', fa: 'اح' },
    hue: 215,
  },
  {
    id: 'nora',
    name: { en: 'Nora Okafor', fa: 'نورا کاظمی' },
    initials: { en: 'NO', fa: 'نک' },
    hue: 160,
  },
  {
    id: 'liam',
    name: { en: 'Liam Chen', fa: 'کیان نوری' },
    initials: { en: 'LC', fa: 'کن' },
    hue: 38,
  },
  {
    id: 'maya',
    name: { en: 'Maya Patel', fa: 'مایا صادقی' },
    initials: { en: 'MP', fa: 'مص' },
    hue: 275,
  },
  {
    id: 'david',
    name: { en: 'David Moreau', fa: 'داوود مرادی' },
    initials: { en: 'DM', fa: 'دم' },
    hue: 8,
  },
];

const LABELS: Record<string, Label> = {
  frontend: { text: { en: 'Frontend', fa: 'فرانت‌اند' }, hue: 215 },
  backend: { text: { en: 'Backend', fa: 'بک‌اند' }, hue: 150 },
  design: { text: { en: 'Design', fa: 'طراحی' }, hue: 305 },
  a11y: { text: { en: 'Accessibility', fa: 'دسترس‌پذیری' }, hue: 185 },
  perf: { text: { en: 'Performance', fa: 'کارایی' }, hue: 32 },
  security: { text: { en: 'Security', fa: 'امنیت' }, hue: 355 },
  docs: { text: { en: 'Docs', fa: 'مستندات' }, hue: 60 },
  i18n: { text: { en: 'i18n', fa: 'چندزبانه' }, hue: 255 },
};

const I18N: Record<
  Lang,
  {
    crumbs: string;
    title: string;
    sprint: string;
    sprintDates: string;
    tasks: string;
    points: string;
    sp: string;
    search: string;
    matches: string;
    add: string;
    empty: string;
    wip: string;
    blocked: string;
    hint: string;
    moved: string;
    language: string;
    direction: string;
    auto: string;
    collapse: string;
    expand: string;
    subtasks: string;
    done: string;
    priority: Record<Priority, string>;
    type: Record<TaskType, string>;
    newTasks: string[];
  }
> = {
  en: {
    crumbs: 'Projects / Storefront / Board',
    title: 'Checkout redesign',
    sprint: 'Sprint 24',
    sprintDates: 'Oct 27 – Nov 7',
    tasks: 'tasks',
    points: 'story points',
    sp: 'SP',
    search: 'Search tasks, labels, people…',
    matches: 'found',
    add: 'Add task',
    empty: 'Drop tasks here',
    wip: 'WIP',
    blocked: 'Blocked',
    hint: 'Tip: focus a card, press an arrow key to lift it, Enter to drop, Esc to cancel.',
    moved: 'Moved',
    language: 'Language',
    direction: 'Direction',
    collapse: 'Collapse section',
    expand: 'Expand section',
    subtasks: 'subtasks',
    done: 'Done',
    auto: 'Auto',
    priority: { highest: 'Highest', high: 'High', medium: 'Medium', low: 'Low' },
    type: { story: 'Story', bug: 'Bug', task: 'Task', epic: 'Epic', spike: 'Spike' },
    newTasks: [
      'Review analytics events',
      'Tidy up the cart tests',
      'Write release notes',
      'Spike: Apple Pay sheet',
    ],
  },
  fa: {
    crumbs: 'پروژه‌ها / فروشگاه / برد',
    title: 'بازطراحی فرایند پرداخت',
    sprint: 'اسپرینت ۲۴',
    sprintDates: '۵ تا ۱۶ آبان',
    tasks: 'وظیفه',
    points: 'امتیاز داستان',
    sp: 'امتیاز',
    search: 'جستجوی وظیفه، برچسب، افراد…',
    matches: 'نتیجه',
    add: 'افزودن وظیفه',
    empty: 'وظیفه را اینجا رها کنید',
    wip: 'سقف کار',
    blocked: 'مسدود',
    hint: 'نکته: روی کارت فوکوس کنید، با کلیدهای جهت‌نما بلندش کنید، Enter برای رها کردن و Esc برای لغو.',
    moved: 'منتقل شد',
    language: 'زبان',
    direction: 'جهت',
    auto: 'خودکار',
    collapse: 'بستن بخش',
    expand: 'باز کردن بخش',
    subtasks: 'زیروظیفه',
    done: 'انجام‌شده',
    priority: { highest: 'بحرانی', high: 'بالا', medium: 'متوسط', low: 'پایین' },
    type: { story: 'داستان', bug: 'باگ', task: 'وظیفه', epic: 'حماسه', spike: 'پژوهش' },
    newTasks: [
      'بازبینی رویدادهای تحلیلی',
      'مرتب‌سازی تست‌های سبد خرید',
      'نوشتن یادداشت انتشار',
      'پژوهش: صفحه‌ی Apple Pay',
    ],
  },
};

const day = (offset: number): Date => {
  const d = new Date();
  d.setHours(12, 0, 0, 0);
  d.setDate(d.getDate() + offset);
  return d;
};

function buildBoard(): Column[] {
  const task = (
    t: Omit<Task, 'comments' | 'attachments' | 'assignees' | 'labels'> & Partial<Task>,
  ): Task => ({
    comments: 0,
    attachments: 0,
    assignees: [],
    labels: [],
    ...t,
  });

  return [
    {
      id: 'todo',
      hue: 255,
      title: { en: 'To do', fa: 'برای انجام' },
      sections: [
        {
          id: 'backlog',
          collapsed: false,
          title: { en: 'Backlog', fa: 'بک‌لاگ' },
          tasks: [
            task({
              id: 't231',
              key: 'NGX-231',
              type: 'epic',
              priority: 'medium',
              points: 21,
              title: { en: 'Multi-currency checkout', fa: 'پرداخت چندارزی' },
              description: {
                en: 'Support EUR, GBP and IRR with live exchange rates and per-currency rounding rules.',
                fa: 'پشتیبانی از یورو، پوند و ریال با نرخ لحظه‌ای ارز و قوانین گردکردن مخصوص هر ارز.',
              },
              assignees: ['amir', 'sara'],
              labels: ['backend'],
              subtasks: { done: 2, total: 9 },
              comments: 12,
              attachments: 3,
              due: day(21),
            }),
            task({
              id: 't244',
              key: 'NGX-244',
              type: 'spike',
              priority: 'low',
              points: 3,
              title: { en: 'Evaluate passkey login', fa: 'ارزیابی ورود با Passkey' },
              description: {
                en: 'Compare WebAuthn libraries and sketch the fallback flow for older browsers.',
                fa: 'مقایسه‌ی کتابخانه‌های WebAuthn و طراحی مسیر جایگزین برای مرورگرهای قدیمی.',
              },
              assignees: ['nora'],
              labels: ['security'],
              comments: 4,
            }),
            task({
              id: 't250',
              key: 'NGX-250',
              type: 'story',
              priority: 'low',
              points: 5,
              title: { en: 'Saved payment methods page', fa: 'صفحه‌ی روش‌های پرداخت ذخیره‌شده' },
              assignees: ['maya'],
              labels: ['frontend', 'design'],
              comments: 2,
              attachments: 1,
            }),
            task({
              id: 't253',
              key: 'NGX-253',
              type: 'task',
              priority: 'low',
              points: 1,
              title: { en: 'Update privacy policy copy', fa: 'به‌روزرسانی متن سیاست حریم خصوصی' },
              assignees: ['david'],
              labels: ['docs'],
            }),
          ],
        },
        {
          id: 'ready',
          collapsed: false,
          title: { en: 'Ready for sprint', fa: 'آماده‌ی اسپرینت' },
          tasks: [
            task({
              id: 't218',
              key: 'NGX-218',
              type: 'story',
              priority: 'high',
              points: 5,
              title: { en: 'Order summary sidebar', fa: 'نوار کناری خلاصه‌ی سفارش' },
              description: {
                en: 'Sticky summary with promo code, shipping estimate and a collapsible line-item list.',
                fa: 'خلاصه‌ی چسبان با کد تخفیف، برآورد هزینه‌ی ارسال و فهرست قابل‌جمع‌شدن اقلام.',
              },
              assignees: ['maya', 'liam'],
              labels: ['frontend', 'design'],
              subtasks: { done: 0, total: 4 },
              comments: 5,
              attachments: 2,
              due: day(4),
            }),
            task({
              id: 't221',
              key: 'NGX-221',
              type: 'bug',
              priority: 'highest',
              points: 3,
              title: {
                en: 'Coupon is applied twice after a refresh',
                fa: 'کد تخفیف پس از رفرش دو بار اعمال می‌شود',
              },
              assignees: ['nora'],
              labels: ['backend'],
              comments: 9,
              due: day(1),
            }),
            task({
              id: 't226',
              key: 'NGX-226',
              type: 'task',
              priority: 'medium',
              points: 2,
              title: {
                en: 'Add skeleton loaders to the cart',
                fa: 'افزودن اسکلت بارگذاری به سبد خرید',
              },
              assignees: ['liam'],
              labels: ['perf', 'frontend'],
              subtasks: { done: 1, total: 3 },
              due: day(6),
            }),
          ],
        },
      ],
    },
    {
      id: 'progress',
      hue: 215,
      wipLimit: 5,
      title: { en: 'In progress', fa: 'در حال انجام' },
      sections: [
        {
          id: 'dev',
          collapsed: false,
          title: { en: 'Development', fa: 'توسعه' },
          tasks: [
            task({
              id: 't203',
              key: 'NGX-203',
              type: 'story',
              priority: 'highest',
              points: 8,
              title: {
                en: 'Address autocomplete with map preview',
                fa: 'تکمیل خودکار آدرس با پیش‌نمایش نقشه',
              },
              description: {
                en: 'Debounced suggestions, keyboard navigation and a lazy-loaded map tile preview.',
                fa: 'پیشنهاد با تأخیر کنترل‌شده، پیمایش با کیبورد و پیش‌نمایش نقشه با بارگذاری تنبل.',
              },
              assignees: ['amir', 'liam'],
              labels: ['frontend'],
              subtasks: { done: 5, total: 8 },
              comments: 14,
              attachments: 4,
              due: day(0),
            }),
            task({
              id: 't209',
              key: 'NGX-209',
              type: 'bug',
              priority: 'high',
              points: 2,
              blocked: true,
              title: {
                en: 'Safari: sticky pay button covers the keyboard',
                fa: 'سافاری: دکمه‌ی چسبان پرداخت روی کیبورد می‌افتد',
              },
              assignees: ['sara'],
              labels: ['frontend', 'a11y'],
              comments: 6,
              due: day(-1),
            }),
            task({
              id: 't212',
              key: 'NGX-212',
              type: 'task',
              priority: 'medium',
              points: 5,
              title: {
                en: 'Rate-limit the payment intents API',
                fa: 'محدودسازی نرخ درخواست‌های API پرداخت',
              },
              assignees: ['nora', 'david', 'amir', 'liam'],
              labels: ['security', 'backend'],
              subtasks: { done: 2, total: 3 },
              comments: 3,
              due: day(3),
            }),
          ],
        },
        {
          id: 'design',
          collapsed: false,
          title: { en: 'Design', fa: 'طراحی' },
          tasks: [
            task({
              id: 't198',
              key: 'NGX-198',
              type: 'story',
              priority: 'medium',
              points: 5,
              title: {
                en: 'Empty states & error illustrations',
                fa: 'حالت‌های خالی و تصویرسازی خطاها',
              },
              assignees: ['maya'],
              labels: ['design'],
              subtasks: { done: 3, total: 6 },
              comments: 7,
              attachments: 6,
              due: day(5),
            }),
            task({
              id: 't201',
              key: 'NGX-201',
              type: 'task',
              priority: 'low',
              points: 3,
              title: { en: 'Dark-mode tokens audit', fa: 'بازبینی توکن‌های حالت تیره' },
              assignees: ['sara', 'maya'],
              labels: ['design', 'a11y'],
              subtasks: { done: 4, total: 5 },
              due: day(2),
            }),
          ],
        },
      ],
    },
    {
      id: 'review',
      hue: 38,
      wipLimit: 4,
      title: { en: 'In review', fa: 'در بازبینی' },
      sections: [
        {
          id: 'code',
          collapsed: false,
          title: { en: 'Code review', fa: 'بازبینی کد' },
          tasks: [
            task({
              id: 't190',
              key: 'NGX-190',
              type: 'story',
              priority: 'high',
              points: 5,
              title: { en: 'RTL layout for the checkout form', fa: 'چیدمان راست‌به‌چپ فرم پرداخت' },
              description: {
                en: 'Logical properties everywhere, mirrored icons and bidi-safe card number inputs.',
                fa: 'استفاده از ویژگی‌های منطقی در همه‌جا، آیکن‌های آینه‌شده و ورودی شماره‌کارت سازگار با bidi.',
              },
              assignees: ['liam', 'amir'],
              labels: ['i18n', 'frontend'],
              subtasks: { done: 6, total: 6 },
              comments: 11,
              attachments: 1,
              due: day(1),
            }),
            task({
              id: 't194',
              key: 'NGX-194',
              type: 'bug',
              priority: 'medium',
              points: 2,
              title: {
                en: 'Tax rounding differs from the invoice',
                fa: 'گردکردن مالیات با فاکتور مغایرت دارد',
              },
              assignees: ['david'],
              labels: ['backend'],
              comments: 3,
              due: day(2),
            }),
          ],
        },
        {
          id: 'qa',
          collapsed: false,
          title: { en: 'QA', fa: 'تست کیفیت' },
          tasks: [
            task({
              id: 't183',
              key: 'NGX-183',
              type: 'task',
              priority: 'high',
              points: 3,
              title: { en: 'Cross-browser regression pass', fa: 'تست رگرسیون روی مرورگرهای مختلف' },
              assignees: ['nora'],
              labels: ['a11y'],
              subtasks: { done: 8, total: 12 },
              comments: 2,
              due: day(0),
            }),
          ],
        },
      ],
    },
    {
      id: 'done',
      hue: 152,
      done: true,
      title: { en: 'Done', fa: 'انجام‌شده' },
      sections: [
        {
          id: 'shipped',
          collapsed: false,
          title: { en: 'Shipped', fa: 'منتشرشده' },
          tasks: [
            task({
              id: 't170',
              key: 'NGX-170',
              type: 'story',
              priority: 'medium',
              points: 8,
              title: { en: 'Guest checkout', fa: 'پرداخت بدون ثبت‌نام' },
              description: {
                en: 'Order without an account, with an optional magic-link to claim the order later.',
                fa: 'ثبت سفارش بدون حساب کاربری، با لینک جادویی اختیاری برای تصاحب سفارش در آینده.',
              },
              assignees: ['amir', 'sara', 'nora'],
              labels: ['frontend', 'backend'],
              subtasks: { done: 7, total: 7 },
              comments: 22,
              attachments: 5,
            }),
            task({
              id: 't174',
              key: 'NGX-174',
              type: 'bug',
              priority: 'low',
              points: 1,
              title: {
                en: 'Fix typo in the order confirmation e-mail',
                fa: 'اصلاح غلط املایی ایمیل تأیید سفارش',
              },
              assignees: ['david'],
              labels: ['docs'],
              subtasks: { done: 1, total: 1 },
              comments: 1,
            }),
            task({
              id: 't176',
              key: 'NGX-176',
              type: 'task',
              priority: 'medium',
              points: 2,
              title: { en: 'Bundle-size budget check in CI', fa: 'بررسی بودجه‌ی حجم باندل در CI' },
              assignees: ['liam'],
              labels: ['perf'],
              subtasks: { done: 3, total: 3 },
              comments: 4,
            }),
          ],
        },
      ],
    },
  ];
}

/* ───────────────────────────── component ───────────────────────────── */

@Component({
  selector: 'app-kanban-view',
  templateUrl: './kanban-view.component.html',
  styleUrls: ['./kanban-view.component.scss'],
  imports: [NgxDraggable, NgxDropList, NgxDropListGroup],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KanbanViewComponent {
  private readonly doc = inject(DOCUMENT);

  readonly lang = signal<Lang>('en');
  readonly dir = signal<Dir>('ltr');
  readonly query = signal('');
  readonly lastMove = signal<{ key: string; column: L10n; section: L10n } | null>(null);
  readonly lastMoveText = computed(() => {
    const m = this.lastMove();
    const l = this.lang();
    return m ? `${this.t().moved} ${m.key} → ${m.column[l]} · ${m.section[l]}` : '';
  });
  readonly columns = signal<Column[]>(buildBoard());

  readonly t = computed(() => I18N[this.lang()]);
  private readonly locale = computed(() => (this.lang() === 'fa' ? 'fa-IR-u-ca-persian' : 'en-US'));
  private readonly numberFormat = computed(
    () => new Intl.NumberFormat(this.lang() === 'fa' ? 'fa-IR' : 'en-US'),
  );
  private readonly dateFormat = computed(
    () => new Intl.DateTimeFormat(this.locale(), { month: 'short', day: 'numeric' }),
  );
  private readonly relativeFormat = computed(
    () => new Intl.RelativeTimeFormat(this.locale(), { numeric: 'auto' }),
  );

  readonly people = new Map(PEOPLE.map((p) => [p.id, p] as const));
  readonly labels = LABELS;
  readonly themes: Theme[] = ['auto', 'light', 'dark'];
  readonly langs: { id: Lang; label: string }[] = [
    { id: 'en', label: 'EN' },
    { id: 'fa', label: 'فا' },
  ];
  readonly dirs: Dir[] = ['ltr', 'rtl'];

  readonly totalTasks = computed(() => this.columns().reduce((n, c) => n + this.count(c), 0));
  readonly totalPoints = computed(() => this.columns().reduce((n, c) => n + this.points(c), 0));
  readonly donePoints = computed(() =>
    this.columns()
      .filter((c) => c.done)
      .reduce((n, c) => n + this.points(c), 0),
  );
  readonly progressPct = computed(() =>
    this.totalPoints() ? Math.round((this.donePoints() / this.totalPoints()) * 100) : 0,
  );
  readonly matchCount = computed(() => {
    if (!this.query().trim()) return 0;
    let n = 0;
    for (const c of this.columns())
      for (const s of c.sections) for (const t of s.tasks) if (this.matches(t)) n++;
    return n;
  });

  private nextKey = 260;
  private nextId = 1;

  constructor() {
    // The drag preview lives in <body>, outside this component. Direction, language and
    // `color-scheme` are therefore applied to the document element, so the lifted card keeps
    const root = this.doc.documentElement;
    const previous = { dir: root.dir, lang: root.lang,  };
    effect(() => {
      root.dir = this.dir();
      root.lang = this.lang();
    });
    inject(DestroyRef).onDestroy(() => {
      root.dir = previous.dir;
      root.lang = previous.lang;
    });
  }

  /* ── drag & drop ── */

  onDrop(ev: IDropEvent<Task[]>): void {
    const from = ev.previousContainer.data;
    const to = ev.container.data;
    if (!from || !to) return;
    const task = from[ev.previousIndex];
    if (!task) return;

    if (from === to) moveItemInArray(to, ev.previousIndex, ev.currentIndex);
    else transferArrayItem(from, to, ev.previousIndex, ev.currentIndex);

    const where = this.locate(to);
    if (where)
      this.lastMove.set({
        key: task.key,
        column: where.column.title,
        section: where.section.title,
      });
    this.commit();
  }

  /** The lib mutates the arrays in place; hand OnPush a new reference to render. */
  private commit(): void {
    this.columns.update((cols) =>
      cols.map((c) => ({ ...c, sections: c.sections.map((s) => ({ ...s, tasks: [...s.tasks] })) })),
    );
  }

  private locate(tasks: Task[]): { column: Column; section: Section } | null {
    for (const column of this.columns()) {
      for (const section of column.sections)
        if (section.tasks === tasks) return { column, section };
    }
    return null;
  }

  /* ── board actions ── */

  toggle(sectionId: string): void {
    this.columns.update((cols) =>
      cols.map((c) => ({
        ...c,
        sections: c.sections.map((s) =>
          s.id === sectionId ? { ...s, collapsed: !s.collapsed } : s,
        ),
      })),
    );
  }

  add(sectionId: string): void {
    const titles = I18N.en.newTasks;
    const i = this.nextId++ % titles.length;
    const task: Task = {
      id: `new${this.nextId}`,
      key: `NGX-${this.nextKey++}`,
      type: i === 3 ? 'spike' : 'task',
      priority: 'medium',
      points: 2,
      title: { en: I18N.en.newTasks[i], fa: I18N.fa.newTasks[i] },
      assignees: [PEOPLE[this.nextId % PEOPLE.length].id],
      labels: [],
      comments: 0,
      attachments: 0,
      due: day(7),
    };
    this.columns.update((cols) =>
      cols.map((c) => ({
        ...c,
        sections: c.sections.map((s) =>
          s.id === sectionId ? { ...s, collapsed: false, tasks: [task, ...s.tasks] } : s,
        ),
      })),
    );
  }

  setLang(lang: Lang): void {
    this.lang.set(lang);
    this.dir.set(lang === 'fa' ? 'rtl' : 'ltr');
  }

  onSearch(ev: Event): void {
    this.query.set((ev.target as HTMLInputElement).value);
  }

  /* ── view helpers ── */

  n(value: number): string {
    return this.numberFormat().format(value);
  }

  pct(value: number): string {
    return new Intl.NumberFormat(this.lang() === 'fa' ? 'fa-IR' : 'en-US', {
      style: 'percent',
    }).format(value / 100);
  }

  count(col: Column): number {
    return col.sections.reduce((n, s) => n + s.tasks.length, 0);
  }

  points(col: Column): number {
    return col.sections.reduce((n, s) => n + s.tasks.reduce((p, t) => p + (t.points ?? 0), 0), 0);
  }

  sectionPoints(section: Section): number {
    return section.tasks.reduce((p, t) => p + (t.points ?? 0), 0);
  }

  overWip(col: Column): boolean {
    return !!col.wipLimit && this.count(col) > col.wipLimit;
  }

  matches(task: Task): boolean {
    const q = this.query().trim().toLowerCase();
    if (!q) return true;
    const haystack = [
      task.key,
      task.title.en,
      task.title.fa,
      ...task.labels.flatMap((l) => [LABELS[l].text.en, LABELS[l].text.fa]),
      ...task.assignees.flatMap((p) => [this.people.get(p)!.name.en, this.people.get(p)!.name.fa]),
    ]
      .join(' ')
      .toLowerCase();
    return haystack.includes(q);
  }

  due(task: Task): DueInfo | null {
    if (!task.due) return null;
    const startOfToday = new Date();
    startOfToday.setHours(12, 0, 0, 0);
    const diff = Math.round((task.due.getTime() - startOfToday.getTime()) / 86_400_000);
    const text =
      Math.abs(diff) <= 1
        ? this.relativeFormat().format(diff, 'day')
        : this.dateFormat().format(task.due);
    return { text, state: diff < 0 ? 'overdue' : diff <= 2 ? 'soon' : 'ok' };
  }

  progress(task: Task): number {
    return task.subtasks ? Math.round((task.subtasks.done / task.subtasks.total) * 100) : 0;
  }

  visibleAssignees(task: Task): string[] {
    return task.assignees.slice(0, 3);
  }

  assigneeNames(task: Task): string {
    return task.assignees.map((id) => this.people.get(id)!.name[this.lang()]).join(', ');
  }
}
