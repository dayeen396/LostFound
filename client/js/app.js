(() => {
  'use strict';

  const translations = {
    navBrowse: ['Browse items', 'হারানো-প্রাপ্তি দেখুন'],
    navPost: ['Report an item', 'আইটেম রিপোর্ট করুন'],
    navDashboard: ['My dashboard', 'আমার ড্যাশবোর্ড'],
    navAdmin: ['Moderation', 'পরিচালনা'],
    navLogin: ['Sign in', 'লগ ইন'],
    navLogout: ['Sign out', 'লগ আউট'],
    footerNotice: ['Protect your privacy. Never post an ID number or a full address.', 'আপনার গোপনীয়তা রক্ষা করুন। আইডি নম্বর বা পূর্ণ ঠিকানা প্রকাশ করবেন না।'],
    loading: ['Loading…', 'লোড হচ্ছে…'],
    retry: ['Try again', 'আবার চেষ্টা করুন'],
    homeEyebrow: ['A safer way to reunite what matters', 'প্রিয় জিনিস ফিরে পাওয়ার নিরাপদ উপায়'],
    homeTitle: ['Lost something on campus? Let’s find its way home.', 'ক্যাম্পাসে কিছু হারিয়েছেন? খুঁজে ফিরিয়ে আনি।'],
    homeIntro: ['A community-powered lost and found for students, teachers, staff, and hall residents across the University of Dhaka.', 'ঢাকা বিশ্ববিদ্যালয়ের শিক্ষার্থী, শিক্ষক, কর্মী ও হলবাসীদের জন্য সবার অংশগ্রহণে হারানো-প্রাপ্তি প্ল্যাটফর্ম।'],
    browseFound: ['Browse found items', 'প্রাপ্ত আইটেম দেখুন'],
    reportItem: ['Report lost or found', 'হারানো বা প্রাপ্ত আইটেম রিপোর্ট করুন'],
    privacyFirst: ['Privacy first', 'গোপনীয়তা সবার আগে'],
    privacyShort: ['Contact details stay hidden until a claim is approved.', 'দাবি অনুমোদিত না হওয়া পর্যন্ত যোগাযোগের তথ্য গোপন থাকে।'],
    campusWide: ['Across the whole campus', 'পুরো ক্যাম্পাসজুড়ে'],
    campusShort: ['Search halls, faculties, gates, and shared spaces.', 'হল, অনুষদ, গেট ও সবার ব্যবহারের জায়গায় খুঁজুন।'],
    communityVerified: ['DU community', 'ঢাবি সম্প্রদায়'],
    communityShort: ['DU email users can earn a verified community badge.', 'ঢাবি ইমেইল যাচাই করলে কমিউনিটি ব্যাজ পাওয়া যায়।'],
    recentFound: ['Recently found', 'সম্প্রতি পাওয়া গেছে'],
    recentIntro: ['A few of the latest approved reports from around campus.', 'ক্যাম্পাসের সাম্প্রতিক অনুমোদিত কিছু রিপোর্ট।'],
    seeAll: ['See all items', 'সব আইটেম দেখুন'],
    safeClaimTitle: ['Claim with confidence', 'নিশ্চিত হয়ে দাবি করুন'],
    safeClaimBody: ['Describe a detail only the real owner would know. Moderators and the person who posted the item can review your answer.', 'শুধু প্রকৃত মালিক জানেন এমন বৈশিষ্ট্য লিখুন। মডারেটর ও পোস্টদাতা আপনার উত্তর যাচাই করতে পারবেন।'],
    feedTitle: ['Campus item board', 'ক্যাম্পাস আইটেম বোর্ড'],
    feedIntro: ['Search approved listings by item, category, location, and date. Sign in to browse lost-item reports.', 'আইটেম, বিভাগ, স্থান ও তারিখ দিয়ে অনুমোদিত পোস্ট খুঁজুন। হারানো আইটেম দেখতে লগ ইন করুন।'],
    keyword: ['Search by keyword', 'শব্দ দিয়ে খুঁজুন'],
    allTypes: ['All types', 'সব ধরনের'],
    lost: ['Lost', 'হারিয়েছে'],
    found: ['Found', 'পাওয়া গেছে'],
    allCategories: ['All categories', 'সব বিভাগ'],
    allLocations: ['All locations', 'সব স্থান'],
    statusFilter: ['Status', 'অবস্থা'],
    fromDate: ['From date', 'শুরুর তারিখ'],
    toDate: ['To date', 'শেষ তারিখ'],
    search: ['Search', 'খুঁজুন'],
    results: ['results', 'টি ফলাফল'],
    noResults: ['No items match these filters.', 'এই ফিল্টারে কোনো আইটেম পাওয়া যায়নি।'],
    clearFilters: ['Clear filters', 'ফিল্টার মুছুন'],
    previous: ['Previous', 'আগের'],
    next: ['Next', 'পরের'],
    page: ['Page', 'পৃষ্ঠা'],
    signInRequired: ['Sign in to continue', 'চালিয়ে যেতে লগ ইন করুন'],
    loginTitle: ['Welcome back', 'আবার স্বাগতম'],
    loginIntro: ['Sign in to report an item, send a claim, and manage your posts.', 'আইটেম রিপোর্ট, দাবি পাঠানো ও পোস্ট পরিচালনার জন্য লগ ইন করুন।'],
    email: ['Email address', 'ইমেইল ঠিকানা'],
    password: ['Password', 'পাসওয়ার্ড'],
    showPassword: ['Show password', 'পাসওয়ার্ড দেখান'],
    forgotPassword: ['Forgot password?', 'পাসওয়ার্ড ভুলে গেছেন?'],
    noAccount: ['New to the board?', 'নতুন অ্যাকাউন্ট দরকার?'],
    createAccount: ['Create an account', 'অ্যাকাউন্ট তৈরি করুন'],
    loginButton: ['Sign in', 'লগ ইন'],
    registerTitle: ['Join the campus community', 'ক্যাম্পাস সম্প্রদায়ে যোগ দিন'],
    registerIntro: ['A DU email or student ID is welcome but not required. Verify your DU email to show a community badge.', 'ঢাবি ইমেইল বা শিক্ষার্থী আইডি থাকলে ভালো, তবে বাধ্যতামূলক নয়। ঢাবি ইমেইল যাচাই করলে কমিউনিটি ব্যাজ দেখা যাবে।'],
    fullName: ['Full name', 'পুরো নাম'],
    confirmPassword: ['Confirm password', 'পাসওয়ার্ড নিশ্চিত করুন'],
    affiliation: ['I am a…', 'আমি…'],
    chooseOne: ['Choose one', 'একটি বেছে নিন'],
    student: ['Student', 'শিক্ষার্থী'],
    teacher: ['Teacher', 'শিক্ষক'],
    staff: ['Staff', 'কর্মী'],
    hallResident: ['Hall resident', 'হলবাসী'],
    other: ['Other', 'অন্যান্য'],
    departmentHall: ['Department or hall (optional)', 'বিভাগ বা হল (ঐচ্ছিক)'],
    studentId: ['Student ID (optional)', 'শিক্ষার্থী আইডি (ঐচ্ছিক)'],
    idPrivacy: ['Your student ID is stored as a one-way hash and is never shown publicly.', 'আপনার শিক্ষার্থী আইডি একমুখী হ্যাশ হিসেবে সংরক্ষিত হয়, কখনো প্রকাশ্যে দেখানো হয় না।'],
    alreadyAccount: ['Already have an account?', 'আগেই অ্যাকাউন্ট আছে?'],
    resetTitle: ['Reset your password', 'পাসওয়ার্ড পুনরায় সেট করুন'],
    resetIntro: ['Enter your account email. If it exists, we’ll send a time-limited reset link.', 'অ্যাকাউন্টের ইমেইল লিখুন। অ্যাকাউন্ট থাকলে মেয়াদসহ রিসেট লিংক পাঠানো হবে।'],
    sendReset: ['Send reset link', 'রিসেট লিংক পাঠান'],
    newPassword: ['New password', 'নতুন পাসওয়ার্ড'],
    setPassword: ['Set new password', 'নতুন পাসওয়ার্ড সেট করুন'],
    verifyEmail: ['Verify email', 'ইমেইল যাচাই করুন'],
    verifyInProgress: ['Checking your verification link…', 'যাচাই লিংক পরীক্ষা হচ্ছে…'],
    itemDetails: ['Item details', 'আইটেমের বিবরণ'],
    itemMissing: ['This item is unavailable or has been removed.', 'এই আইটেমটি পাওয়া যাচ্ছে না বা সরানো হয়েছে।'],
    postedBy: ['Posted by', 'পোস্ট করেছেন'],
    when: ['When', 'কখন'],
    where: ['Where', 'কোথায়'],
    extraLocation: ['Extra location detail', 'অতিরিক্ত স্থানের বিবরণ'],
    handover: ['Handed in at', 'জমা দেওয়া হয়েছে'],
    publicDescription: ['Description', 'বিবরণ'],
    privateClue: ['Private identifying detail', 'ব্যক্তিগত শনাক্তকরণ তথ্য'],
    contactOnlyAfterApproval: ['Contact details are shared only after a claim is approved.', 'দাবি অনুমোদিত হলেই কেবল যোগাযোগের তথ্য শেয়ার করা হবে।'],
    claimItem: ['Claim this item', 'এই আইটেমটি দাবি করুন'],
    claimProof: ['Describe a unique mark or detail that proves this item is yours.', 'এমন কোনো বিশেষ দাগ বা বৈশিষ্ট্য লিখুন যা প্রমাণ করে আইটেমটি আপনার।'],
    claimSend: ['Send claim for review', 'যাচাইয়ের জন্য দাবি পাঠান'],
    reportPost: ['Report this post', 'এই পোস্ট রিপোর্ট করুন'],
    reportReason: ['Reason for report', 'রিপোর্টের কারণ'],
    spam: ['Spam', 'স্প্যাম'],
    fake: ['Possibly fake', 'সম্ভবত ভুয়া'],
    inappropriate: ['Inappropriate', 'অনুপযুক্ত'],
    privacy: ['Privacy concern', 'গোপনীয়তার সমস্যা'],
    otherReason: ['Other', 'অন্যান্য'],
    reportDetails: ['Add context (optional)', 'বিস্তারিত (ঐচ্ছিক)'],
    sendReport: ['Send report', 'রিপোর্ট পাঠান'],
    editPost: ['Edit post', 'পোস্ট সম্পাদনা'],
    postTitle: ['Report an item', 'আইটেম রিপোর্ট করুন'],
    postIntro: ['Posts are reviewed by a moderator before they appear publicly. Keep identifying details private.', 'পাবলিক হওয়ার আগে মডারেটর পোস্ট যাচাই করেন। শনাক্তকারী তথ্য গোপন রাখুন।'],
    typeLabel: ['This item was…', 'আইটেমটি…'],
    titleLabel: ['Short title', 'সংক্ষিপ্ত শিরোনাম'],
    category: ['Category', 'বিভাগ'],
    location: ['Campus location', 'ক্যাম্পাসের স্থান'],
    occurredAt: ['Date and approximate time', 'তারিখ ও আনুমানিক সময়'],
    descriptionLabel: ['Public description', 'সবার জন্য বিবরণ'],
    descriptionHint: ['Do not include a full ID number, private serial number, or information that would make a false claim easy.', 'সম্পূর্ণ আইডি নম্বর, ব্যক্তিগত সিরিয়াল নম্বর বা ভুয়া দাবি সহজ করে এমন তথ্য দেবেন না।'],
    proofLabel: ['Private identifying detail (optional)', 'ব্যক্তিগত শনাক্তকরণ তথ্য (ঐচ্ছিক)'],
    proofHint: ['Only moderators and claim reviewers can see this detail.', 'শুধু মডারেটর ও দাবির যাচাইকারীরা এই তথ্য দেখতে পারবেন।'],
    extraLocationLabel: ['Nearby landmark or exact spot (optional)', 'কাছের পরিচিত স্থান বা নির্দিষ্ট জায়গা (ঐচ্ছিক)'],
    contactPreference: ['Preferred contact after claim approval', 'দাবি অনুমোদনের পর যোগাযোগের পছন্দ'],
    internalMessage: ['Private message in claim', 'দাবির ব্যক্তিগত বার্তা'],
    contactEmail: ['Email after approval', 'অনুমোদনের পর ইমেইল'],
    contactPhone: ['Phone after approval', 'অনুমোদনের পর ফোন'],
    imageUpload: ['Photos (up to 3)', 'ছবি (সর্বোচ্চ ৩টি)'],
    imageHint: ['JPEG, PNG, or WebP. Maximum file size is configured by the administrator.', 'JPEG, PNG বা WebP। সর্বোচ্চ ফাইল সাইজ প্রশাসক নির্ধারণ করেন।'],
    handoverLabel: ['Where is it being kept? (optional)', 'আইটেমটি কোথায় রাখা হয়েছে? (ঐচ্ছিক)'],
    submitPost: ['Submit for review', 'যাচাইয়ের জন্য জমা দিন'],
    savePost: ['Save changes', 'পরিবর্তন সংরক্ষণ'],
    dashboardTitle: ['Your campus dashboard', 'আপনার ক্যাম্পাস ড্যাশবোর্ড'],
    dashboardIntro: ['Keep track of your posts, claims, and account updates.', 'আপনার পোস্ট, দাবি ও অ্যাকাউন্ট আপডেট দেখুন।'],
    myPosts: ['My posts', 'আমার পোস্ট'],
    myClaims: ['My claims', 'আমার দাবি'],
    notifications: ['Notifications', 'বিজ্ঞপ্তি'],
    profile: ['Profile', 'প্রোফাইল'],
    receivedClaims: ['Claims on my found posts', 'আমার প্রাপ্ত আইটেমের দাবি'],
    noPosts: ['You have not posted any items yet.', 'আপনি এখনো কোনো আইটেম পোস্ট করেননি।'],
    noClaims: ['You have not submitted any claims yet.', 'আপনি এখনো কোনো দাবি পাঠাননি।'],
    noNotifications: ['You have no notifications.', 'আপনার কোনো বিজ্ঞপ্তি নেই।'],
    markRead: ['Mark read', 'পঠিত হিসেবে চিহ্নিত'],
    approve: ['Approve', 'অনুমোদন'],
    reject: ['Reject', 'প্রত্যাখ্যান'],
    reviewNote: ['Optional note to claimant', 'দাবিদারকে ঐচ্ছিক বার্তা'],
    readMessages: ['Open claim messages', 'দাবির বার্তা খুলুন'],
    sendMessage: ['Send message', 'বার্তা পাঠান'],
    messagePlaceholder: ['Write a private message…', 'ব্যক্তিগত বার্তা লিখুন…'],
    saveProfile: ['Save profile', 'প্রোফাইল সংরক্ষণ'],
    phone: ['Phone (private)', 'ফোন (গোপনীয়)'],
    verifiedBadge: ['Verified DU community', 'যাচাইকৃত ঢাবি সম্প্রদায়'],
    pending: ['Pending review', 'যাচাই অপেক্ষমাণ'],
    open: ['Open', 'চলমান'],
    claimPending: ['Claim pending', 'দাবি অপেক্ষমাণ'],
    returned: ['Returned', 'ফেরত দেওয়া হয়েছে'],
    archived: ['Archived', 'সংরক্ষণাগারে'],
    approved: ['Approved', 'অনুমোদিত'],
    rejected: ['Rejected', 'প্রত্যাখ্যাত'],
    withdrawn: ['Withdrawn', 'প্রত্যাহার করা হয়েছে'],
    adminTitle: ['Community moderation', 'কমিউনিটি পরিচালনা'],
    adminIntro: ['Review posts and claims, keep campus data current, and protect the community.', 'পোস্ট ও দাবি যাচাই করুন, ক্যাম্পাসের তথ্য হালনাগাদ রাখুন, সম্প্রদায়কে সুরক্ষিত রাখুন।'],
    overview: ['Overview', 'সারসংক্ষেপ'],
    moderationPosts: ['Posts', 'পোস্ট'],
    moderationClaims: ['Claims', 'দাবি'],
    moderationReports: ['Reports', 'রিপোর্ট'],
    manageUsers: ['Users', 'ব্যবহারকারী'],
    manageCategories: ['Categories', 'বিভাগ'],
    manageLocations: ['Locations', 'স্থান'],
    roleUser: ['Member', 'সদস্য'],
    roleModerator: ['Moderator', 'মডারেটর'],
    roleAdmin: ['Administrator', 'প্রশাসক'],
    reviewing: ['Reviewing', 'যাচাই হচ্ছে'],
    resolved: ['Resolved', 'সমাধান হয়েছে'],
    dismissed: ['Dismissed', 'খারিজ'],
    totalItems: ['Total items', 'মোট আইটেম'],
    pendingPosts: ['Pending posts', 'অপেক্ষমাণ পোস্ট'],
    pendingClaims: ['Pending claims', 'অপেক্ষমাণ দাবি'],
    activeUsers: ['Active users', 'সক্রিয় ব্যবহারকারী'],
    openReports: ['Open reports', 'খোলা রিপোর্ট'],
    returnRate: ['Return rate', 'ফেরত হার'],
    byLocation: ['Items by location', 'স্থান অনুযায়ী আইটেম'],
    noQueue: ['Nothing is waiting in this queue.', 'এই তালিকায় কিছু অপেক্ষমাণ নেই।'],
    itemOwner: ['Posted by', 'পোস্টদাতা'],
    moderateNote: ['Review note (optional)', 'যাচাই নোট (ঐচ্ছিক)'],
    apply: ['Apply', 'প্রয়արկել'],
    ban: ['Ban', 'নিষিদ্ধ করুন'],
    suspend: ['Suspend', 'সাময়িক বন্ধ'],
    activate: ['Activate', 'সক্রিয় করুন'],
    active: ['Active', 'সক্রিয়'],
    suspended: ['Suspended', 'সাময়িক বন্ধ'],
    banned: ['Banned', 'নিষিদ্ধ'],
    addCategory: ['Add a category', 'বিভাগ যোগ করুন'],
    addLocation: ['Add a campus location', 'ক্যাম্পাসের স্থান যোগ করুন'],
    nameEnglish: ['Name in English', 'ইংরেজি নাম'],
    nameBangla: ['Name in Bangla', 'বাংলা নাম'],
    locationType: ['Location type', 'স্থানের ধরন'],
    locationParent: ['Parent area (optional)', 'উপরের এলাকা (ঐচ্ছিক)'],
    sortOrder: ['Sort order', 'ক্রম'],
    deactivate: ['Deactivate', 'নিষ্ক্রিয় করুন'],
    activateAction: ['Activate', 'সক্রিয় করুন'],
    locationCaution: ['Seed campus and hall names need verification by the University before public launch.', 'প্রকাশের আগে বিশ্ববিদ্যালয় থেকে ক্যাম্পাস ও হলের নাম যাচাই করুন।'],
    academic: ['Academic', 'একাডেমিক'],
    studentSpace: ['Student space', 'শিক্ষার্থী এলাকা'],
    hall: ['Hall', 'হল'],
    transport: ['Transport', 'পরিবহন'],
    gate: ['Gate', 'গেট'],
    noPermission: ['You do not have permission to view this page.', 'এই পৃষ্ঠা দেখার অনুমতি আপনার নেই।'],
    notFound: ['Page not found', 'পৃষ্ঠা পাওয়া যায়নি'],
    backHome: ['Return home', 'হোমে ফিরুন'],
    save: ['Save', 'সংরক্ষণ'],
    cancel: ['Cancel', 'বাতিল'],
    details: ['Details', 'বিস্তারিত'],
    passwordHint: ['Use at least 10 characters.', 'কমপক্ষে ১০টি অক্ষর ব্যবহার করুন।'],
    passwordMismatch: ['Passwords do not match.', 'পাসওয়ার্ড মিলছে না।'],
    imageLimit: ['Choose no more than 3 images.', 'সর্বোচ্চ ৩টি ছবি বেছে নিন।'],
    emailLinkHint: ['On local setup, reset and verification links are shown in the server terminal.', 'স্থানীয় ব্যবস্থায় রিসেট ও যাচাই লিংক সার্ভার টার্মিনালে দেখানো হয়।'],
    communityPrompt: ['Together, we can return more than lost belongings.', 'একসাথে আমরা হারানো জিনিস ফিরিয়ে দিতে পারি।']
  };

  function readPreference(key, fallback) {
    try {
      return localStorage.getItem(key) || fallback;
    } catch (error) {
      console.warn(`Unable to read the ${key} preference:`, error);
      return fallback;
    }
  }

  function savePreference(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      console.warn(`Unable to save the ${key} preference:`, error);
    }
  }

  const savedLanguage = readPreference('du-lf-lang', 'en');
  const savedTheme = readPreference('du-lf-theme', 'light');
  const state = {
    lang: savedLanguage === 'bn' ? 'bn' : 'en',
    theme: savedTheme === 'dark' ? 'dark' : 'light',
    user: null,
    categories: [],
    locations: [],
    feedPage: 1,
    feedFilters: {},
    adminTab: 'overview',
    dashboardTab: 'posts',
    currentMessageClaim: null
  };
  const main = document.querySelector('#main-content');
  const notice = document.querySelector('#notice');
  const t = key => (translations[key] || [key, key])[state.lang === 'bn' ? 1 : 0];
  const tr = (en, bn) => state.lang === 'bn' ? bn : en;
  const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, character => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[character]);
  const locale = () => state.lang === 'bn' ? 'bn-BD' : 'en-US';
  const dateText = value => value ? new Date(value).toLocaleString(locale(), { dateStyle: 'medium', timeStyle: 'short' }) : '—';
  const dateOnly = value => value ? new Date(value).toLocaleDateString(locale(), { dateStyle: 'medium' }) : '—';
  const selected = (value, current) => String(value) === String(current) ? ' selected' : '';
  const currentRoute = () => {
    const raw = location.hash.slice(1) || 'home';
    const [path, query = ''] = raw.split('?');
    return { path: path.replace(/^\/+|\/+$/g, '') || 'home', params: new URLSearchParams(query) };
  };
  const go = path => { location.hash = path; };

  async function api(url, options = {}) {
    const headers = new Headers(options.headers || {});
    if (options.body && !(options.body instanceof FormData) && !headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }
    const response = await fetch(url, { credentials: 'same-origin', ...options, headers });
    const type = response.headers.get('content-type') || '';
    const body = type.includes('application/json') ? await response.json() : await response.text();
    if (!response.ok) {
      const error = new Error(typeof body === 'object' && body.error ? body.error : `Request failed (${response.status})`);
      error.status = response.status;
      error.details = typeof body === 'object' ? body.details : null;
      throw error;
    }
    return body;
  }

  function showNotice(message, kind = 'success') {
    const text = kind === 'error'
      ? `${message} · ${tr('Please try again or contact a moderator.', 'আবার চেষ্টা করুন অথবা মডারেটরের সঙ্গে যোগাযোগ করুন।')}`
      : message;
    notice.innerHTML = `<div class="toast ${kind === 'error' ? 'error' : 'success'}" role="status">${escapeHtml(text)}</div>`;
    window.clearTimeout(showNotice.timer);
    showNotice.timer = window.setTimeout(() => { notice.replaceChildren(); }, 5000);
  }

  function setLoading(message = t('loading')) {
    main.innerHTML = `<div class="loading" role="status">${escapeHtml(message)}</div>`;
  }

  function emptyState(title, message = '') {
    return `<div class="empty-state"><strong>${escapeHtml(title)}</strong>${message ? `<span>${escapeHtml(message)}</span>` : ''}</div>`;
  }

  function statusBadge(status) {
    const key = {
      pending: 'pending', approved: 'approved', rejected: 'rejected',
      open: 'open', claim_pending: 'claimPending', returned: 'returned',
      archived: 'archived', active: 'active', suspended: 'suspended', banned: 'banned'
    }[status] || 'details';
    return `<span class="badge badge-${escapeHtml(status)}">${escapeHtml(t(key))}</span>`;
  }

  function itemCard(item) {
    const picture = item.images && item.images.length
      ? `<img class="item-image" src="${escapeHtml(item.images[0].url)}" alt="${escapeHtml(item.title)}" loading="lazy">`
      : `<div class="item-image-placeholder" aria-hidden="true">${item.itemType === 'found' ? '✓' : '?'}</div>`;
    return `<article class="item-card">
      <a class="item-card-link" href="#item/${encodeURIComponent(item.id)}" aria-label="${escapeHtml(item.title)}">
        ${picture}
        <div class="item-card-body">
          <div class="tag-row"><span class="badge badge-${escapeHtml(item.itemType)}">${escapeHtml(t(item.itemType))}</span>${statusBadge(item.status)}</div>
          <h3>${escapeHtml(item.title)}</h3>
          <p>${escapeHtml(item.description)}</p>
          <div class="item-meta">
            <span>⌖ ${label(item.location)}</span>
            <span>◷ ${escapeHtml(dateOnly(item.occurredAt))}</span>
          </div>
          <div class="item-meta"><span>${label(item.category)}</span><span>${escapeHtml(item.postedBy?.name || '')}${item.postedBy?.duVerified ? ` · <span class="verified">${escapeHtml(t('verifiedBadge'))}</span>` : ''}</span></div>
        </div>
      </a>
    </article>`;
  }

  function label(value) {
    if (!value) return '';
    return escapeHtml(state.lang === 'bn' ? (value.bn || value.en || '') : (value.en || value.bn || ''));
  }

  async function loadLookups(force = false) {
    if (!force && state.categories.length && state.locations.length) return;
    const [categories, locations] = await Promise.all([api('/api/categories'), api('/api/locations')]);
    state.categories = categories.categories;
    state.locations = locations.locations;
  }

  function updateHeader() {
    document.documentElement.lang = state.lang;
    document.documentElement.dataset.theme = state.theme;
    document.querySelectorAll('[data-i18n]').forEach(node => {
      node.textContent = t(node.dataset.i18n);
    });
    const languageButton = document.querySelector('[data-language]');
    if (languageButton) languageButton.textContent = state.lang === 'bn' ? 'English' : 'বাংলা';
    const themeButton = document.querySelector('[data-theme]');
    if (themeButton) {
      themeButton.setAttribute('aria-label', tr('Toggle dark mode', 'ডার্ক মোড পরিবর্তন করুন'));
      themeButton.textContent = state.theme === 'dark' ? '☀' : '◐';
    }
    document.querySelectorAll('[data-auth-only]').forEach(node => { node.hidden = !state.user; });
    document.querySelectorAll('[data-guest-only]').forEach(node => { node.hidden = Boolean(state.user); });
    document.querySelectorAll('[data-admin-only]').forEach(node => {
      node.hidden = !state.user || !['admin', 'moderator'].includes(state.user.role);
    });
    const logoutButton = document.querySelector('[data-logout]');
    if (logoutButton) logoutButton.hidden = !state.user;
    const route = currentRoute().path.split('/')[0];
    document.querySelectorAll('[data-nav]').forEach(node => {
      if (node.dataset.nav === route) node.setAttribute('aria-current', 'page');
      else node.removeAttribute('aria-current');
    });
  }

  async function renderHome() {
    setLoading();
    try {
      const [feed, categories, locations] = await Promise.all([
        api('/api/items?type=found&limit=3'),
        api('/api/categories'),
        api('/api/locations')
      ]);
      state.categories = categories.categories;
      state.locations = locations.locations;
      main.innerHTML = `
        <section class="hero">
          <div class="hero-content">
            <p class="eyebrow">${escapeHtml(t('homeEyebrow'))}</p>
            <h1>${escapeHtml(t('homeTitle'))}</h1>
            <p>${escapeHtml(t('homeIntro'))}</p>
            <div class="hero-actions">
              <a class="button" href="#feed">${escapeHtml(t('browseFound'))} <span aria-hidden="true">→</span></a>
              <a class="button button-outline" href="${state.user ? '#post' : '#register'}">${escapeHtml(t('reportItem'))}</a>
            </div>
          </div>
          <div class="hero-art" aria-hidden="true"><div class="hero-orbit"><div class="hero-token"><span>RETURNED</span></div></div></div>
        </section>
        <section class="trust-strip" aria-label="${escapeHtml(tr('Community principles', 'কমিউনিটির নীতি'))}">
          <div class="trust-item"><span class="trust-icon" aria-hidden="true">◇</span><div><strong>${escapeHtml(t('privacyFirst'))}</strong><span>${escapeHtml(t('privacyShort'))}</span></div></div>
          <div class="trust-item"><span class="trust-icon" aria-hidden="true">⌖</span><div><strong>${escapeHtml(t('campusWide'))}</strong><span>${escapeHtml(t('campusShort'))}</span></div></div>
          <div class="trust-item"><span class="trust-icon" aria-hidden="true">✓</span><div><strong>${escapeHtml(t('communityVerified'))}</strong><span>${escapeHtml(t('communityShort'))}</span></div></div>
        </section>
        <section>
          <div class="section-heading"><div><h2>${escapeHtml(t('recentFound'))}</h2><p>${escapeHtml(t('recentIntro'))}</p></div><a class="button button-outline button-small" href="#feed">${escapeHtml(t('seeAll'))}</a></div>
          ${feed.items.length ? `<div class="card-grid">${feed.items.map(itemCard).join('')}</div>` : emptyState(t('noResults'))}
        </section>
        <section class="panel" style="margin-top:2rem">
          <div class="section-heading" style="margin:0 0 .7rem"><div><h2>${escapeHtml(t('safeClaimTitle'))}</h2><p>${escapeHtml(t('safeClaimBody'))}</p></div></div>
          <a class="button button-small" href="#feed">${escapeHtml(t('browseFound'))}</a>
        </section>`;
    } catch (error) {
      renderError(error, renderHome);
    }
  }

  function filterOptions(items, current, allLabel) {
    return `<option value="">${escapeHtml(allLabel)}</option>${items.map(item => `<option value="${escapeHtml(item.id)}"${selected(item.id, current)}>${label(item)}</option>`).join('')}`;
  }

  async function renderFeed(params = new URLSearchParams()) {
    setLoading();
    try {
      await loadLookups();
      const page = Math.max(1, Number(params.get('page') || state.feedPage) || 1);
      state.feedPage = page;
      const filters = {
        q: params.get('q') || '', type: params.get('type') || '', status: params.get('status') || '',
        categoryId: params.get('categoryId') || '', locationId: params.get('locationId') || '',
        from: params.get('from') || '', to: params.get('to') || ''
      };
      state.feedFilters = filters;
      const search = new URLSearchParams({ page, limit: 9 });
      for (const [key, value] of Object.entries(filters)) if (value) search.set(key, value);
      const result = await api(`/api/items?${search}`);
      main.innerHTML = `
        <header class="page-heading"><p class="eyebrow">${escapeHtml(tr('University of Dhaka · Campus-wide', 'ঢাকা বিশ্ববিদ্যালয় · পুরো ক্যাম্পাস'))}</p><h1>${escapeHtml(t('feedTitle'))}</h1><p>${escapeHtml(t('feedIntro'))}</p></header>
        <form class="filter-panel" id="feed-filter">
          <div class="filter-grid">
            <label class="field search-field"><span>${escapeHtml(t('keyword'))}</span><input name="q" value="${escapeHtml(filters.q)}" maxlength="120" placeholder="${escapeHtml(tr('Item, detail, or place', 'আইটেম, বিবরণ বা স্থান'))}"></label>
            <label class="field"><span>${escapeHtml(t('allTypes'))}</span><select name="type"><option value="">${escapeHtml(t('allTypes'))}</option><option value="lost"${selected('lost', filters.type)}>${escapeHtml(t('lost'))}</option><option value="found"${selected('found', filters.type)}>${escapeHtml(t('found'))}</option></select></label>
            <label class="field"><span>${escapeHtml(t('statusFilter'))}</span><select name="status"><option value="">${escapeHtml(tr('Any status', 'যেকোনো অবস্থা'))}</option><option value="open"${selected('open', filters.status)}>${escapeHtml(t('open'))}</option><option value="claim_pending"${selected('claim_pending', filters.status)}>${escapeHtml(t('claimPending'))}</option><option value="returned"${selected('returned', filters.status)}>${escapeHtml(t('returned'))}</option><option value="archived"${selected('archived', filters.status)}>${escapeHtml(t('archived'))}</option></select></label>
            <label class="field"><span>${escapeHtml(t('category'))}</span><select name="categoryId">${filterOptions(state.categories, filters.categoryId, t('allCategories'))}</select></label>
            <label class="field"><span>${escapeHtml(t('location'))}</span><select name="locationId">${filterOptions(state.locations, filters.locationId, t('allLocations'))}</select></label>
            <label class="field"><span>${escapeHtml(t('fromDate'))}</span><input type="date" name="from" value="${escapeHtml(filters.from)}"></label>
            <label class="field"><span>${escapeHtml(t('toDate'))}</span><input type="date" name="to" value="${escapeHtml(filters.to)}"></label>
            <button class="button" type="submit">${escapeHtml(t('search'))}</button>
          </div>
          ${Object.values(filters).some(Boolean) ? `<div class="form-actions"><a class="button-link" href="#feed">${escapeHtml(t('clearFilters'))}</a></div>` : ''}
        </form>
        <div class="section-heading"><div><h2>${escapeHtml(`${result.pagination.total} ${t('results')}`)}</h2></div></div>
        ${result.items.length ? `<div class="card-grid">${result.items.map(itemCard).join('')}</div>` : emptyState(t('noResults'), t('communityPrompt'))}
        ${result.pagination.pages > 1 ? `<nav class="pagination" aria-label="${escapeHtml(tr('Feed pages', 'ফিড পৃষ্ঠা'))}">
          <button class="button button-outline button-small" data-page="${page - 1}" ${page <= 1 ? 'disabled' : ''}>${escapeHtml(t('previous'))}</button>
          <span>${escapeHtml(t('page'))} ${page} / ${result.pagination.pages}</span>
          <button class="button button-outline button-small" data-page="${page + 1}" ${page >= result.pagination.pages ? 'disabled' : ''}>${escapeHtml(t('next'))}</button>
        </nav>` : ''}`;
    } catch (error) {
      renderError(error, () => renderFeed(params));
    }
  }

  async function renderAuth(mode = 'login', params = new URLSearchParams()) {
    const modes = ['login', 'register', 'forgot', 'reset', 'verify'];
    if (!modes.includes(mode)) return renderNotFound();
    if (mode === 'verify') {
      setLoading(t('verifyInProgress'));
      const token = params.get('token') || currentRoute().params.get('token') || '';
      try {
        await api('/api/auth/verify-email', { method: 'POST', body: JSON.stringify({ token }) });
        showNotice(tr('Email verified. You can now sign in.', 'ইমেইল যাচাই হয়েছে। এখন লগ ইন করতে পারেন।'));
        go('login');
      } catch (error) {
        renderError(error, () => renderAuth('verify', new URLSearchParams({ token })));
      }
      return;
    }
    if (mode === 'reset') {
      main.innerHTML = `<div class="auth-wrap"><header class="page-heading"><h1>${escapeHtml(t('resetTitle'))}</h1></header>
        <section class="panel"><form id="reset-form">
          <input type="hidden" name="token" value="${escapeHtml(params.get('token') || '')}">
          <div class="field"><label for="reset-password">${escapeHtml(t('newPassword'))}</label><input id="reset-password" name="password" type="password" autocomplete="new-password" minlength="10" maxlength="128" required><small>${escapeHtml(t('passwordHint'))}</small></div>
          <p class="form-error" data-form-error></p><button class="button" type="submit">${escapeHtml(t('setPassword'))}</button>
        </form></section></div>`;
      return;
    }
    const tabs = `<nav class="auth-tabs"><a href="#login" class="${mode === 'login' ? 'active' : ''}">${escapeHtml(t('loginButton'))}</a><a href="#register" class="${mode === 'register' ? 'active' : ''}">${escapeHtml(t('createAccount'))}</a></nav>`;
    if (mode === 'forgot') {
      main.innerHTML = `<div class="auth-wrap"><header class="page-heading"><h1>${escapeHtml(t('resetTitle'))}</h1><p>${escapeHtml(t('resetIntro'))}</p></header>
        <section class="panel"><form id="forgot-form">
          <div class="field"><label for="forgot-email">${escapeHtml(t('email'))}</label><input id="forgot-email" type="email" name="email" autocomplete="email" maxlength="254" required></div>
          <p class="form-error" data-form-error></p><div class="form-actions"><button class="button" type="submit">${escapeHtml(t('sendReset'))}</button><a class="button button-quiet" href="#login">${escapeHtml(t('cancel'))}</a></div>
        </form><hr class="divider"><p class="small muted">${escapeHtml(t('emailLinkHint'))}</p></section></div>`;
      return;
    }
    if (mode === 'login') {
      main.innerHTML = `<div class="auth-wrap"><header class="page-heading"><p class="eyebrow">${escapeHtml(tr('DU community access', 'ঢাবি কমিউনিটি অ্যাক্সেস'))}</p><h1>${escapeHtml(t('loginTitle'))}</h1><p>${escapeHtml(t('loginIntro'))}</p></header>
        ${tabs}<section class="panel"><form id="login-form">
          <div class="field"><label for="login-email">${escapeHtml(t('email'))}</label><input id="login-email" type="email" name="email" autocomplete="email" maxlength="254" required></div>
          <div class="field" style="margin-top:.9rem"><label for="login-password">${escapeHtml(t('password'))}</label><input id="login-password" type="password" name="password" autocomplete="current-password" maxlength="128" required></div>
          <p class="form-error" data-form-error></p><div class="form-actions"><button class="button" type="submit">${escapeHtml(t('loginButton'))}</button><a class="button-link" href="#forgot">${escapeHtml(t('forgotPassword'))}</a></div>
        </form><hr class="divider"><p class="small muted">${escapeHtml(t('noAccount'))} <a href="#register">${escapeHtml(t('createAccount'))}</a></p></section></div>`;
      return;
    }
    main.innerHTML = `<div class="auth-wrap"><header class="page-heading"><p class="eyebrow">${escapeHtml(tr('Belong to the community', 'কমিউনিটির অংশ হোন'))}</p><h1>${escapeHtml(t('registerTitle'))}</h1><p>${escapeHtml(t('registerIntro'))}</p></header>
      ${tabs}<section class="panel"><form id="register-form">
        <div class="form-grid">
          <div class="field span-2"><label for="reg-name">${escapeHtml(t('fullName'))}</label><input id="reg-name" name="name" autocomplete="name" minlength="2" maxlength="120" required></div>
          <div class="field span-2"><label for="reg-email">${escapeHtml(t('email'))}</label><input id="reg-email" type="email" name="email" autocomplete="email" maxlength="254" required></div>
          <div class="field"><label for="reg-password">${escapeHtml(t('password'))}</label><input id="reg-password" type="password" name="password" autocomplete="new-password" minlength="10" maxlength="128" required><small>${escapeHtml(t('passwordHint'))}</small></div>
          <div class="field"><label for="reg-confirm">${escapeHtml(t('confirmPassword'))}</label><input id="reg-confirm" type="password" name="confirmPassword" autocomplete="new-password" minlength="10" maxlength="128" required></div>
          <div class="field"><label for="reg-affiliation">${escapeHtml(t('affiliation'))}</label><select id="reg-affiliation" name="affiliation"><option value="other">${escapeHtml(t('chooseOne'))}</option><option value="student">${escapeHtml(t('student'))}</option><option value="teacher">${escapeHtml(t('teacher'))}</option><option value="staff">${escapeHtml(t('staff'))}</option><option value="hall_resident">${escapeHtml(t('hallResident'))}</option><option value="other">${escapeHtml(t('other'))}</option></select></div>
          <div class="field"><label for="reg-department">${escapeHtml(t('departmentHall'))}</label><input id="reg-department" name="departmentOrHall" maxlength="160"></div>
          <div class="field span-2"><label for="reg-id">${escapeHtml(t('studentId'))}</label><input id="reg-id" name="studentId" maxlength="32" autocomplete="off"><small>${escapeHtml(t('idPrivacy'))}</small></div>
        </div>
        <p class="form-error" data-form-error></p>
        <div class="form-actions"><button class="button" type="submit">${escapeHtml(t('createAccount'))}</button></div>
      </form><hr class="divider"><p class="small muted">${escapeHtml(t('alreadyAccount'))} <a href="#login">${escapeHtml(t('loginButton'))}</a></p></section></div>`;
  }

  async function renderItem(id) {
    setLoading();
    try {
      const { item } = await api(`/api/items/${encodeURIComponent(id)}`);
      const isOwner = state.user && String(state.user.id) === String(item.postedBy.id);
      const gallery = item.images.length
        ? `<div class="gallery"><img id="featured-image" class="featured-image" src="${escapeHtml(item.images[0].url)}" alt="${escapeHtml(item.title)}">${item.images.length > 1 ? `<div class="gallery-thumbs">${item.images.map((image, index) => `<button type="button" data-image="${escapeHtml(image.url)}" data-alt="${escapeHtml(item.title)}" aria-label="${escapeHtml(tr(`View image ${index + 1}`, `ছবি ${index + 1} দেখুন`))}" aria-current="${index === 0}"><img src="${escapeHtml(image.url)}" alt="" loading="lazy"></button>`).join('')}</div>` : ''}</div>`
        : `<div class="item-image-placeholder" style="height:300px;border-radius:16px" aria-hidden="true">${item.itemType === 'found' ? '✓' : '?'}</div>`;
      let actionPanel = '';
      if (isOwner) {
        actionPanel = `<section class="panel"><h2>${escapeHtml(t('details'))}</h2><p>${escapeHtml(t('privateClue'))}: ${escapeHtml(item.privateDetails || '—')}</p>${item.moderationNote ? `<div class="help-callout">${escapeHtml(t('moderateNote'))}: ${escapeHtml(item.moderationNote)}</div>` : ''}<div class="button-row" style="margin-top:1rem"><a class="button button-outline button-small" href="#post/${encodeURIComponent(item.id)}">${escapeHtml(t('editPost'))}</a><button class="button button-danger button-small" data-delete-item="${escapeHtml(item.id)}">${escapeHtml(tr('Delete post', 'পোস্ট মুছুন'))}</button></div></section>`;
      } else if (item.itemType === 'found' && item.status !== 'returned' && item.status !== 'archived') {
        actionPanel = state.user
          ? `<section class="panel"><h2>${escapeHtml(t('claimItem'))}</h2><p class="small muted">${escapeHtml(t('safeClaimBody'))}</p><form id="claim-form" data-item-id="${escapeHtml(item.id)}"><div class="field"><label for="claim-answer">${escapeHtml(t('claimProof'))}</label><textarea id="claim-answer" name="proofAnswer" minlength="10" maxlength="2000" required></textarea></div><p class="form-error" data-form-error></p><div class="form-actions"><button class="button" type="submit">${escapeHtml(t('claimSend'))}</button></div></form></section>
            <section class="panel"><h3>${escapeHtml(t('reportPost'))}</h3><form id="report-form" data-item-id="${escapeHtml(item.id)}"><div class="field"><label for="report-reason">${escapeHtml(t('reportReason'))}</label><select id="report-reason" name="reason" required><option value="spam">${escapeHtml(t('spam'))}</option><option value="fake">${escapeHtml(t('fake'))}</option><option value="inappropriate">${escapeHtml(t('inappropriate'))}</option><option value="privacy">${escapeHtml(t('privacy'))}</option><option value="other">${escapeHtml(t('otherReason'))}</option></select></div><div class="field" style="margin-top:.7rem"><label for="report-details">${escapeHtml(t('reportDetails'))}</label><textarea id="report-details" name="details" maxlength="1000"></textarea></div><p class="form-error" data-form-error></p><button class="button button-outline button-small" type="submit">${escapeHtml(t('sendReport'))}</button></form></section>`
          : `<section class="panel"><h2>${escapeHtml(t('claimItem'))}</h2><p class="muted small">${escapeHtml(t('contactOnlyAfterApproval'))}</p><a class="button" href="#login">${escapeHtml(t('signInRequired'))}</a></section>`;
      }
      const contactHtml = item.contact
        ? `<section class="panel"><h3>${escapeHtml(tr('Approved contact', 'অনুমোদিত যোগাযোগ'))}</h3>${item.contact.email ? `<p>${escapeHtml(item.contact.email)}</p>` : ''}${item.contact.phone ? `<p>${escapeHtml(item.contact.phone)}</p>` : ''}${item.contact.via ? `<a href="#dashboard">${escapeHtml(t('readMessages'))}</a>` : ''}</section>`
        : `<div class="help-callout">${escapeHtml(t('contactOnlyAfterApproval'))}</div>`;
      main.innerHTML = `
        <p><a href="#feed">← ${escapeHtml(t('feedTitle'))}</a></p>
        <div class="detail-layout">
          <div>
            ${gallery}
            <article class="panel" style="margin-top:1rem">
              <div class="tag-row"><span class="badge badge-${escapeHtml(item.itemType)}">${escapeHtml(t(item.itemType))}</span>${statusBadge(item.status)}<span class="badge">${label(item.category)}</span></div>
              <h1 class="detail-title">${escapeHtml(item.title)}</h1>
              <div class="item-meta"><span>⌖ ${label(item.location)}</span><span>◷ ${escapeHtml(dateText(item.occurredAt))}</span></div>
              <hr class="divider"><h2>${escapeHtml(t('publicDescription'))}</h2>
              <p class="detail-description">${escapeHtml(item.description)}</p>
              ${item.extraLocationText ? `<p><strong>${escapeHtml(t('extraLocation'))}:</strong> ${escapeHtml(item.extraLocationText)}</p>` : ''}
              ${item.handoverDetails ? `<p><strong>${escapeHtml(t('handover'))}:</strong> ${escapeHtml(item.handoverDetails)}</p>` : ''}
              <p class="small muted">${escapeHtml(t('postedBy'))}: ${escapeHtml(item.postedBy.name)}${item.postedBy.duVerified ? ` · <span class="verified">${escapeHtml(t('verifiedBadge'))}</span>` : ''}</p>
            </article>
          </div>
          <aside class="detail-side">
            ${actionPanel}
            ${contactHtml}
          </aside>
        </div>`;
    } catch (error) {
      renderError(error, () => renderItem(id));
    }
  }

  async function renderPost(id = '') {
    if (!state.user) {
      main.innerHTML = `<section class="panel" style="max-width:560px;margin:3rem auto;text-align:center"><h1>${escapeHtml(t('signInRequired'))}</h1><p class="muted">${escapeHtml(t('postIntro'))}</p><a class="button" href="#login">${escapeHtml(t('loginButton'))}</a></section>`;
      return;
    }
    setLoading();
    try {
      await loadLookups();
      let item = null;
      if (id) {
        const response = await api(`/api/items/${encodeURIComponent(id)}`);
        item = response.item;
        if (String(item.postedBy.id) !== String(state.user.id)) {
          main.innerHTML = emptyState(t('noPermission'));
          return;
        }
      }
      const edit = Boolean(item);
      const type = item?.itemType || 'found';
      const categoryId = item?.category.id || '';
      const locationId = item?.location.id || '';
      const occurred = item?.occurredAt ? new Date(item.occurredAt).toISOString().slice(0, 16) : new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16);
      main.innerHTML = `<header class="page-heading"><p class="eyebrow">${escapeHtml(tr('Share a safe, useful report', 'নিরাপদ ও কার্যকর রিপোর্ট দিন'))}</p><h1>${escapeHtml(edit ? t('editPost') : t('postTitle'))}</h1><p>${escapeHtml(t('postIntro'))}</p></header>
        <form class="panel" id="post-form" data-item-id="${edit ? escapeHtml(item.id) : ''}">
          <div class="form-grid">
            <div class="field"><label for="post-type">${escapeHtml(t('typeLabel'))}</label><select id="post-type" name="itemType" required><option value="found"${selected('found', type)}>${escapeHtml(t('found'))}</option><option value="lost"${selected('lost', type)}>${escapeHtml(t('lost'))}</option></select></div>
            <div class="field"><label for="post-title">${escapeHtml(t('titleLabel'))}</label><input id="post-title" name="title" minlength="3" maxlength="180" required value="${escapeHtml(item?.title || '')}"></div>
            <div class="field"><label for="post-category">${escapeHtml(t('category'))}</label><select id="post-category" name="categoryId" required>${filterOptions(state.categories, categoryId, t('chooseOne'))}</select></div>
            <div class="field"><label for="post-location">${escapeHtml(t('location'))}</label><select id="post-location" name="locationId" required>${filterOptions(state.locations, locationId, t('chooseOne'))}</select></div>
            <div class="field"><label for="post-date">${escapeHtml(t('occurredAt'))}</label><input id="post-date" name="occurredAt" type="datetime-local" value="${escapeHtml(occurred)}" required></div>
            <div class="field"><label for="post-extra">${escapeHtml(t('extraLocationLabel'))}</label><input id="post-extra" name="extraLocationText" maxlength="240" value="${escapeHtml(item?.extraLocationText || '')}"></div>
            <div class="field span-2"><label for="post-description">${escapeHtml(t('descriptionLabel'))}</label><textarea id="post-description" name="description" minlength="10" maxlength="5000" required>${escapeHtml(item?.description || '')}</textarea><small>${escapeHtml(t('descriptionHint'))}</small></div>
            <div class="field span-2"><label for="post-private">${escapeHtml(t('proofLabel'))}</label><textarea id="post-private" name="privateDetails" maxlength="1500">${escapeHtml(item?.privateDetails || '')}</textarea><small>${escapeHtml(t('proofHint'))}</small></div>
            <div class="field"><label for="post-contact">${escapeHtml(t('contactPreference'))}</label><select id="post-contact" name="contactPreference"><option value="internal_message"${selected('internal_message', item?.contactPreference || 'internal_message')}>${escapeHtml(t('internalMessage'))}</option><option value="email"${selected('email', item?.contactPreference)}>${escapeHtml(t('contactEmail'))}</option><option value="phone"${selected('phone', item?.contactPreference)}>${escapeHtml(t('contactPhone'))}</option></select></div>
            <div class="field"><label for="post-handover">${escapeHtml(t('handoverLabel'))}</label><input id="post-handover" name="handoverDetails" maxlength="500" value="${escapeHtml(item?.handoverDetails || '')}"></div>
            <div class="field span-2"><label for="post-images">${escapeHtml(t('imageUpload'))}</label><input id="post-images" name="images" type="file" accept="image/jpeg,image/png,image/webp" multiple><small>${escapeHtml(t('imageHint'))}${item?.images?.length ? ` · ${tr('Current images are kept when no new image is selected.', 'নতুন ছবি না দিলে বর্তমান ছবিগুলো রাখা হবে।')}` : ''}</small></div>
          </div>
          <p class="form-error" data-form-error></p>
          <div class="form-actions"><button class="button" type="submit">${escapeHtml(edit ? t('savePost') : t('submitPost'))}</button><a class="button button-quiet" href="#dashboard">${escapeHtml(t('cancel'))}</a></div>
        </form>`;
    } catch (error) {
      renderError(error, () => renderPost(id));
    }
  }

  async function renderDashboard() {
    if (!state.user) return renderAuth('login');
    setLoading();
    try {
      const [dashboard, profile] = await Promise.all([api('/api/dashboard'), api('/api/me')]);
      state.user = profile.user;
      const tab = state.dashboardTab;
      const tabs = [
        ['posts', 'myPosts'], ['claims', 'myClaims'], ['received', 'receivedClaims'],
        ['notifications', 'notifications'], ['profile', 'profile']
      ];
      let content = '';
      if (tab === 'posts') {
        content = dashboard.items.length ? `<div class="data-list">${dashboard.items.map(item => `<div class="data-row"><div class="data-row-main"><strong><a href="#item/${escapeHtml(item.id)}">${escapeHtml(item.title)}</a></strong><small>${escapeHtml(t(item.itemType))} · ${label({ en: item.categoryEn, bn: item.categoryBn })} · ${label({ en: item.locationEn, bn: item.locationBn })} · ${escapeHtml(dateOnly(item.createdAt))}</small></div><div class="data-row-actions">${statusBadge(item.moderationStatus)}${statusBadge(item.status)}<a class="button button-outline button-small" href="#post/${escapeHtml(item.id)}">${escapeHtml(t('editPost'))}</a>${item.status !== 'claim_pending' ? `<button class="button button-quiet button-small" data-delete-item="${escapeHtml(item.id)}">${escapeHtml(tr('Delete', 'মুছুন'))}</button>` : ''}</div></div>`).join('')}</div>` : emptyState(t('noPosts'));
      } else if (tab === 'claims') {
        content = dashboard.claims.length ? `<div class="data-list">${dashboard.claims.map(claim => `<div class="data-row"><div class="data-row-main"><strong><a href="#item/${escapeHtml(claim.itemId)}">${escapeHtml(claim.itemTitle)}</a></strong><small>${escapeHtml(t(claim.itemType))} · ${escapeHtml(dateText(claim.createdAt))}${claim.reviewNote ? ` · ${escapeHtml(claim.reviewNote)}` : ''}</small></div><div class="data-row-actions">${statusBadge(claim.status)}${claim.status === 'approved' ? `<button class="button button-outline button-small" data-messages="${escapeHtml(claim.id)}">${escapeHtml(t('readMessages'))}</button>` : ''}</div></div>`).join('')}</div>` : emptyState(t('noClaims'));
      } else if (tab === 'received') {
        const ownedFound = dashboard.items.filter(item => item.itemType === 'found');
        const claimGroups = await Promise.all(ownedFound.map(async item => {
          try { return { item, claims: (await api(`/api/items/${item.id}/claims`)).claims }; }
          catch (error) { if (error.status === 403 || error.status === 404) return { item, claims: [] }; throw error; }
        }));
        const received = claimGroups.flatMap(group => group.claims.map(claim => ({ ...claim, itemTitle: group.item.title })));
        content = received.length ? `<div class="data-list">${received.map(claim => `<article class="panel"><div class="panel-header"><div><h3>${escapeHtml(claim.claimantName)} · ${escapeHtml(claim.itemTitle)}</h3><p class="small muted">${escapeHtml(dateText(claim.createdAt))} · ${claim.claimantDuVerified ? escapeHtml(t('verifiedBadge')) : ''}</p></div>${statusBadge(claim.status)}</div><p class="field-label">${escapeHtml(t('claimProof'))}</p><div class="claim-box">${escapeHtml(claim.proofAnswer)}</div>${claim.status === 'pending' ? `<form class="review-claim-form" data-claim-id="${escapeHtml(claim.id)}"><div class="field" style="margin-top:.7rem"><label for="claim-note-${escapeHtml(claim.id)}">${escapeHtml(t('reviewNote'))}</label><input id="claim-note-${escapeHtml(claim.id)}" name="reviewNote" maxlength="500"></div><div class="form-actions"><button class="button button-small" name="decision" value="approved">${escapeHtml(t('approve'))}</button><button class="button button-danger button-small" name="decision" value="rejected">${escapeHtml(t('reject'))}</button></div></form>` : claim.status === 'approved' ? `<button class="button button-outline button-small" data-messages="${escapeHtml(claim.id)}">${escapeHtml(t('readMessages'))}</button>` : claim.reviewNote ? `<p class="small muted">${escapeHtml(t('reviewNote'))}: ${escapeHtml(claim.reviewNote)}</p>` : ''}</article>`).join('')}</div>` : emptyState(t('noClaims'), t('receivedClaims'));
      } else if (tab === 'notifications') {
        content = dashboard.notifications.length ? `<div class="data-list">${dashboard.notifications.map(item => `<div class="data-row"><div class="data-row-main"><strong>${escapeHtml(notificationLabel(item))}</strong><small>${escapeHtml(dateText(item.createdAt))}</small></div><div class="data-row-actions">${!item.readAt ? `<button class="button button-outline button-small" data-read-notification="${escapeHtml(item.id)}">${escapeHtml(t('markRead'))}</button>` : statusBadge('approved')}</div></div>`).join('')}</div>` : emptyState(t('noNotifications'));
      } else {
        content = `<form id="profile-form" class="form-grid">
          <div class="field"><label for="profile-name">${escapeHtml(t('fullName'))}</label><input id="profile-name" name="name" value="${escapeHtml(profile.user.name)}" maxlength="120" required></div>
          <div class="field"><label for="profile-email">${escapeHtml(t('email'))}</label><input id="profile-email" value="${escapeHtml(profile.user.email)}" disabled></div>
          <div class="field"><label for="profile-phone">${escapeHtml(t('phone'))}</label><input id="profile-phone" name="phone" type="tel" value="${escapeHtml(profile.user.phone || '')}" maxlength="32"></div>
          <div class="field"><label for="profile-affiliation">${escapeHtml(t('affiliation'))}</label><select id="profile-affiliation" name="affiliation">${['student', 'teacher', 'staff', 'hall_resident', 'other'].map(value => `<option value="${value}"${selected(value, profile.user.affiliation)}>${escapeHtml(t(value === 'hall_resident' ? 'hallResident' : value))}</option>`).join('')}</select></div>
          <div class="field"><label for="profile-department">${escapeHtml(t('departmentHall'))}</label><input id="profile-department" name="departmentOrHall" value="${escapeHtml(profile.user.departmentOrHall || '')}" maxlength="160"></div>
          <div class="field"><label for="profile-locale">${escapeHtml(tr('Interface language', 'ইন্টারফেসের ভাষা'))}</label><select id="profile-locale" name="locale"><option value="en"${selected('en', profile.user.locale)}>English</option><option value="bn"${selected('bn', profile.user.locale)}>বাংলা</option></select></div>
          <div class="span-2 form-actions"><button class="button" type="submit">${escapeHtml(t('saveProfile'))}</button><span class="verified">${profile.user.duVerified ? escapeHtml(t('verifiedBadge')) : ''}</span></div>
          <p class="form-error span-2" data-form-error></p>
        </form>`;
      }
      main.innerHTML = `<header class="page-heading"><p class="eyebrow">${escapeHtml(tr('Your account', 'আপনার অ্যাকাউন্ট'))}</p><h1>${escapeHtml(t('dashboardTitle'))}</h1><p>${escapeHtml(t('dashboardIntro'))}</p></header>
        <div class="tabs" role="tablist">${tabs.map(([key, title]) => `<button type="button" role="tab" aria-selected="${tab === key}" data-dashboard-tab="${key}">${escapeHtml(t(title))}</button>`).join('')}</div>
        <section class="panel">${content}</section>`;
    } catch (error) {
      if (error.status === 401) { state.user = null; updateHeader(); return renderAuth('login'); }
      renderError(error, renderDashboard);
    }
  }

  function notificationLabel(notification) {
    const data = notification.payload || {};
    const title = data.title ? ` · ${data.title}` : '';
    const messages = {
      item_submitted: tr('Your post is waiting for moderator review', 'আপনার পোস্ট মডারেটর যাচাই করছেন'),
      item_approved: tr('Your post was approved', 'আপনার পোস্ট অনুমোদিত হয়েছে'),
      item_rejected: tr('Your post was not approved', 'আপনার পোস্ট অনুমোদিত হয়নি'),
      claim_received: tr('A new claim was sent for your found item', 'আপনার প্রাপ্ত আইটেমে নতুন দাবি এসেছে'),
      claim_approved: tr('Your claim was approved', 'আপনার দাবি অনুমোদিত হয়েছে'),
      claim_rejected: tr('Your claim was not approved', 'আপনার দাবি অনুমোদিত হয়নি'),
      new_message: tr('You have a new private claim message', 'দাবির নতুন ব্যক্তিগত বার্তা এসেছে')
    };
    return `${messages[notification.eventType] || notification.eventType}${title}`;
  }

  async function renderMessages(claimId) {
    state.currentMessageClaim = claimId;
    const host = main.querySelector('#message-thread');
    if (!host) return;
    host.innerHTML = `<div class="loading">${escapeHtml(t('loading'))}</div>`;
    try {
      const { messages } = await api(`/api/claims/${claimId}/messages`);
      host.innerHTML = `${messages.length ? `<div class="data-list">${messages.map(message => `<div class="data-row"><div class="data-row-main"><strong>${escapeHtml(message.senderName)}${String(message.senderId) === String(state.user.id) ? ` · ${escapeHtml(tr('You', 'আপনি'))}` : ''}</strong><small>${escapeHtml(dateText(message.createdAt))}</small><p>${escapeHtml(message.body)}</p></div></div>`).join('')}</div>` : emptyState(tr('No messages yet.', 'এখনো কোনো বার্তা নেই।'))}
        <form id="message-form" data-claim-id="${escapeHtml(claimId)}" class="inline-form" style="margin-top:1rem"><label class="visually-hidden" for="message-body">${escapeHtml(t('messagePlaceholder'))}</label><input id="message-body" name="body" placeholder="${escapeHtml(t('messagePlaceholder'))}" minlength="1" maxlength="3000" required><button class="button button-small" type="submit">${escapeHtml(t('sendMessage'))}</button><p class="form-error" data-form-error></p></form>`;
    } catch (error) {
      host.innerHTML = `<p class="form-error">${escapeHtml(error.message)}</p>`;
    }
  }

  async function renderAdmin(tab = 'overview') {
    if (!state.user) return renderAuth('login');
    if (!['admin', 'moderator'].includes(state.user.role)) {
      main.innerHTML = emptyState(t('noPermission'));
      return;
    }
    state.adminTab = tab;
    setLoading();
    const tabs = [
      ['overview', 'overview'], ['posts', 'moderationPosts'], ['claims', 'moderationClaims'],
      ['reports', 'moderationReports'], ['users', 'manageUsers'], ['categories', 'manageCategories'],
      ['locations', 'manageLocations']
    ];
    try {
      let content = '';
      if (tab === 'overview') {
        const { stats, itemsByLocation } = await api('/api/admin/overview');
        const statsData = [
          ['totalItems', stats.totalItems], ['pendingPosts', stats.pendingPosts],
          ['pendingClaims', stats.pendingClaims], ['activeUsers', stats.activeUsers],
          ['openReports', stats.openReports], ['returnRate', `${stats.returnRate}%`]
        ];
        const maximum = Math.max(1, ...itemsByLocation.map(location => Number(location.itemCount)));
        content = `<div class="stat-grid">${statsData.map(([key, value]) => `<div class="stat-card"><span>${escapeHtml(t(key))}</span><strong>${escapeHtml(value)}</strong></div>`).join('')}</div>
          <div class="section-heading"><div><h2>${escapeHtml(t('byLocation'))}</h2></div></div>
          <div class="data-list">${itemsByLocation.map(location => `<div class="data-row"><div class="data-row-main"><strong>${label(location)}</strong><small>${escapeHtml(location.itemCount)} ${escapeHtml(t('results'))}</small><div class="progress-track" aria-label="${escapeHtml(`${location.itemCount} items`)}"><span style="width:${Math.min(100, Number(location.itemCount) / maximum * 100)}%"></span></div></div></div>`).join('')}</div>`;
      } else if (tab === 'posts') {
        const { items } = await api('/api/admin/items?status=pending');
        content = items.length ? `<div class="data-list">${items.map(item => `<article class="panel"><div class="panel-header"><div><h3>${escapeHtml(item.title)}</h3><p class="small muted">${escapeHtml(t(item.itemType))} · ${escapeHtml(item.postedBy)} · ${label({ en: item.locationEn, bn: item.locationBn })} · ${escapeHtml(dateText(item.occurredAt))}</p></div>${statusBadge(item.moderationStatus)}</div><p class="detail-description">${escapeHtml(item.description)}</p><p class="small muted">${label({ en: item.categoryEn, bn: item.categoryBn })}</p><form class="moderate-post-form" data-item-id="${escapeHtml(item.id)}"><div class="field"><label for="post-note-${escapeHtml(item.id)}">${escapeHtml(t('moderateNote'))}</label><input id="post-note-${escapeHtml(item.id)}" name="note" maxlength="500"></div><div class="form-actions"><button class="button button-small" name="decision" value="approved">${escapeHtml(t('approve'))}</button><button class="button button-danger button-small" name="decision" value="rejected">${escapeHtml(t('reject'))}</button><a class="button button-quiet button-small" href="#item/${escapeHtml(item.id)}">${escapeHtml(t('details'))}</a></div></form></article>`).join('')}</div>` : emptyState(t('noQueue'));
      } else if (tab === 'claims') {
        const { claims } = await api('/api/admin/claims');
        content = claims.length ? `<div class="data-list">${claims.map(claim => `<article class="panel"><div class="panel-header"><div><h3>${escapeHtml(claim.claimantName)} · ${escapeHtml(claim.itemTitle)}</h3><p class="small muted">${escapeHtml(tr('Poster', 'পোস্টদাতা'))}: ${escapeHtml(claim.ownerName)} · ${escapeHtml(dateText(claim.createdAt))}</p></div>${statusBadge(claim.status)}</div><p class="field-label">${escapeHtml(t('claimProof'))}</p><div class="claim-box">${escapeHtml(claim.proofAnswer)}</div><form class="review-claim-form" data-claim-id="${escapeHtml(claim.id)}"><div class="field" style="margin-top:.7rem"><label for="admin-claim-note-${escapeHtml(claim.id)}">${escapeHtml(t('reviewNote'))}</label><input id="admin-claim-note-${escapeHtml(claim.id)}" name="reviewNote" maxlength="500"></div><div class="form-actions"><button class="button button-small" name="decision" value="approved">${escapeHtml(t('approve'))}</button><button class="button button-danger button-small" name="decision" value="rejected">${escapeHtml(t('reject'))}</button></div></form></article>`).join('')}</div>` : emptyState(t('noQueue'));
      } else if (tab === 'reports') {
        const { reports } = await api('/api/admin/reports');
        content = reports.length ? `<div class="data-list">${reports.map(report => `<div class="data-row"><div class="data-row-main"><strong>${escapeHtml(report.itemTitle)} · ${escapeHtml(t(report.reason === 'other' ? 'otherReason' : report.reason))}</strong><small>${escapeHtml(report.reporterName)} · ${escapeHtml(dateText(report.createdAt))}${report.details ? ` · ${escapeHtml(report.details)}` : ''}</small></div><div class="data-row-actions"><a class="button button-quiet button-small" href="#item/${escapeHtml(report.itemId)}">${escapeHtml(t('details'))}</a><form class="report-status-form inline-form" data-report-id="${escapeHtml(report.id)}"><select name="status" aria-label="${escapeHtml(t('apply'))}"><option value="reviewing">${escapeHtml(t('reviewing'))}</option><option value="resolved">${escapeHtml(t('resolved'))}</option><option value="dismissed">${escapeHtml(t('dismissed'))}</option></select><button class="button button-outline button-small" type="submit">${escapeHtml(t('apply'))}</button></form></div></div>`).join('')}</div>` : emptyState(t('noQueue'));
      } else if (tab === 'users') {
        if (state.user.role !== 'admin') {
          content = emptyState(t('noPermission'));
        } else {
          const { users } = await api('/api/admin/users');
          content = `<div class="table-wrap"><table><thead><tr><th>${escapeHtml(t('fullName'))}</th><th>${escapeHtml(t('email'))}</th><th>${escapeHtml(t('affiliation'))}</th><th>${escapeHtml(tr('Role/status', 'ভূমিকা/অবস্থা'))}</th><th>${escapeHtml(t('apply'))}</th></tr></thead><tbody>${users.map(user => `<tr><td>${escapeHtml(user.name)}${user.duVerifiedAt ? `<br><span class="verified">${escapeHtml(t('verifiedBadge'))}</span>` : ''}</td><td>${escapeHtml(user.email)}</td><td>${escapeHtml(t(user.affiliation === 'hall_resident' ? 'hallResident' : user.affiliation))}<br>${escapeHtml(user.departmentOrHall || '')}</td><td>${escapeHtml(t(user.role === 'admin' ? 'roleAdmin' : user.role === 'moderator' ? 'roleModerator' : 'roleUser'))} · ${statusBadge(user.accountStatus)}</td><td>${user.role === 'admin' || String(user.id) === String(state.user.id) ? '—' : `<form class="user-status-form inline-form" data-user-id="${escapeHtml(user.id)}"><select name="status" aria-label="${escapeHtml(t('apply'))}"><option value="active">${escapeHtml(t('activate'))}</option><option value="suspended">${escapeHtml(t('suspend'))}</option><option value="banned">${escapeHtml(t('ban'))}</option></select><button class="button button-outline button-small" type="submit">${escapeHtml(t('apply'))}</button></form>`}</td></tr>`).join('')}</tbody></table></div>`;
        }
      } else if (tab === 'categories') {
        const { categories } = await api('/api/admin/categories');
        content = `<section class="panel"><h2>${escapeHtml(t('addCategory'))}</h2><form id="category-form" class="form-grid"><div class="field"><label for="cat-en">${escapeHtml(t('nameEnglish'))}</label><input id="cat-en" name="nameEn" minlength="2" maxlength="100" required></div><div class="field"><label for="cat-bn">${escapeHtml(t('nameBangla'))}</label><input id="cat-bn" name="nameBn" maxlength="100" required></div><div class="span-2"><button class="button button-small" type="submit">${escapeHtml(t('addCategory'))}</button><p class="form-error" data-form-error></p></div></form></section>
          <div class="data-list" style="margin-top:1rem">${categories.map(category => `<div class="data-row"><div class="data-row-main"><strong>${label(category)}</strong><small>${escapeHtml(category.isActive ? t('active') : t('suspended'))}</small></div><button class="button button-outline button-small" data-toggle-category="${escapeHtml(category.id)}" data-active="${category.isActive}">${escapeHtml(category.isActive ? t('deactivate') : t('activateAction'))}</button></div>`).join('')}</div>`;
      } else if (tab === 'locations') {
        await loadLookups(true);
        const { locations } = await api('/api/admin/locations');
        const locationTypeOptions = ['academic', 'student_space', 'hall', 'transport', 'gate', 'other'];
        content = `<div class="help-callout">${escapeHtml(t('locationCaution'))}</div><section class="panel" style="margin-top:1rem"><h2>${escapeHtml(t('addLocation'))}</h2><form id="location-form" class="form-grid">
          <div class="field"><label for="loc-en">${escapeHtml(t('nameEnglish'))}</label><input id="loc-en" name="nameEn" minlength="2" maxlength="160" required></div>
          <div class="field"><label for="loc-bn">${escapeHtml(t('nameBangla'))}</label><input id="loc-bn" name="nameBn" maxlength="160" required></div>
          <div class="field"><label for="loc-type">${escapeHtml(t('locationType'))}</label><select id="loc-type" name="type">${locationTypeOptions.map(type => `<option value="${type}">${escapeHtml(t(type === 'student_space' ? 'studentSpace' : type))}</option>`).join('')}</select></div>
          <div class="field"><label for="loc-parent">${escapeHtml(t('locationParent'))}</label><select id="loc-parent" name="parentId">${filterOptions(state.locations, '', t('other'))}</select></div>
          <div class="field"><label for="loc-order">${escapeHtml(t('sortOrder'))}</label><input id="loc-order" type="number" min="0" max="10000" name="sortOrder" value="0"></div>
          <div class="span-2"><button class="button button-small" type="submit">${escapeHtml(t('addLocation'))}</button><p class="form-error" data-form-error></p></div>
        </form></section>
        <div class="data-list" style="margin-top:1rem">${locations.map(location => `<div class="data-row"><div class="data-row-main"><strong>${label(location)}</strong><small>${escapeHtml(t(location.type === 'student_space' ? 'studentSpace' : location.type))}${location.parentId ? ` · ${escapeHtml(tr('Sub-area', 'উপ-এলাকা'))}` : ''}</small></div><button class="button button-outline button-small" data-toggle-location="${escapeHtml(location.id)}" data-active="${location.isActive}">${escapeHtml(location.isActive ? t('deactivate') : t('activateAction'))}</button></div>`).join('')}</div>`;
      } else {
        return renderAdmin('overview');
      }
      main.innerHTML = `<header class="page-heading"><p class="eyebrow">${escapeHtml(tr('Administrator tools', 'প্রশাসনিক সরঞ্জাম'))}</p><h1>${escapeHtml(t('adminTitle'))}</h1><p>${escapeHtml(t('adminIntro'))}</p></header>
        <nav class="admin-tabs" aria-label="${escapeHtml(t('adminTitle'))}">${tabs.map(([key, title]) => `<a href="#admin/${key}" class="${tab === key ? 'active' : ''}">${escapeHtml(t(title))}</a>`).join('')}</nav>
        <section class="panel">${content}</section>`;
    } catch (error) {
      if (error.status === 401) { state.user = null; updateHeader(); return renderAuth('login'); }
      if (error.status === 403) { main.innerHTML = emptyState(t('noPermission')); return; }
      renderError(error, () => renderAdmin(tab));
    }
  }

  function renderNotFound() {
    main.innerHTML = `<section class="panel" style="max-width:560px;margin:3rem auto;text-align:center"><p class="eyebrow">404</p><h1>${escapeHtml(t('notFound'))}</h1><p class="muted">${escapeHtml(tr('This page may have moved or the address may be wrong.', 'পৃষ্ঠাটি সরানো হয়েছে অথবা ঠিকানা ভুল হতে পারে।'))}</p><a class="button" href="#home">${escapeHtml(t('backHome'))}</a></section>`;
  }

  function renderError(error, retry) {
    const message = error.status === 404 ? t('itemMissing') : `${error.message} · ${tr('Please check your connection and try again.', 'সংযোগ পরীক্ষা করে আবার চেষ্টা করুন।')}`;
    main.innerHTML = `<section class="panel" style="max-width:680px;margin:2rem auto"><p class="form-error" role="alert">${escapeHtml(message)}</p><div class="form-actions"><button class="button button-outline" data-retry>${escapeHtml(t('retry'))}</button><a class="button button-quiet" href="#home">${escapeHtml(t('backHome'))}</a></div></section>`;
    main.querySelector('[data-retry]')?.addEventListener('click', retry, { once: true });
  }

  async function renderRoute() {
    updateHeader();
    document.body?.classList.remove('menu-open');
    const { path, params } = currentRoute();
    const [route, routeArg] = path.split('/');
    switch (route) {
      case 'home': return renderHome();
      case 'feed': return renderFeed(params);
      case 'login': return renderAuth('login');
      case 'register': return renderAuth('register');
      case 'forgot': return renderAuth('forgot');
      case 'reset': return renderAuth('reset', params);
      case 'verify': return renderAuth('verify', params);
      case 'item': return routeArg ? renderItem(routeArg) : renderNotFound();
      case 'post': return renderPost(routeArg || '');
      case 'dashboard': return renderDashboard();
      case 'admin': return renderAdmin(routeArg || 'overview');
      default: return renderNotFound();
    }
  }

  function formError(form, error) {
    const output = form.querySelector('[data-form-error]');
    if (!output) {
      showNotice(`${error.message} · ${tr('Please try again.', 'আবার চেষ্টা করুন।')}`, 'error');
      return;
    }
    const fields = error.details?.map(detail => detail.message).filter(Boolean) || [];
    output.textContent = `${error.message}${fields.length ? `: ${fields.join(', ')}` : ''} · ${tr('Please review the form and try again.', 'ফর্ম যাচাই করে আবার চেষ্টা করুন।')}`;
    output.setAttribute('role', 'alert');
  }

  function formObject(form) {
    return Object.fromEntries(new FormData(form).entries());
  }

  async function handleSubmit(event) {
    const form = event.target;
    if (!(form instanceof HTMLFormElement)) return;
    const { id } = form;
    if (![
      'feed-filter', 'login-form', 'register-form', 'forgot-form', 'reset-form',
      'claim-form', 'report-form', 'post-form', 'profile-form', 'message-form',
      'category-form', 'location-form'
    ].includes(id) && !form.matches('.review-claim-form, .moderate-post-form, .report-status-form, .user-status-form')) return;
    event.preventDefault();
    const submitter = event.submitter;
    const errorEl = form.querySelector('[data-form-error]');
    if (errorEl) errorEl.textContent = '';
    const button = submitter || form.querySelector('button[type="submit"],button:not([type])');
    if (button) button.disabled = true;
    try {
      if (id === 'feed-filter') {
        const values = formObject(form);
        const search = new URLSearchParams();
        for (const [key, value] of Object.entries(values)) if (value) search.set(key, value);
        go(`feed${search.toString() ? `?${search}` : ''}`);
      } else if (id === 'login-form') {
        const result = await api('/api/auth/login', { method: 'POST', body: JSON.stringify(formObject(form)) });
        state.user = result.user;
        showNotice(tr('You are signed in.', 'আপনি লগ ইন করেছেন।'));
        go('dashboard');
      } else if (id === 'register-form') {
        const data = formObject(form);
        if (data.password !== data.confirmPassword) throw new Error(t('passwordMismatch'));
        delete data.confirmPassword;
        data.locale = state.lang;
        const result = await api('/api/auth/register', { method: 'POST', body: JSON.stringify(data) });
        showNotice(`${result.message} · ${t('emailLinkHint')}`);
        go('login');
      } else if (id === 'forgot-form') {
        const result = await api('/api/auth/forgot-password', { method: 'POST', body: JSON.stringify(formObject(form)) });
        showNotice(`${result.message} · ${t('emailLinkHint')}`);
        go('login');
      } else if (id === 'reset-form') {
        const result = await api('/api/auth/reset-password', { method: 'POST', body: JSON.stringify(formObject(form)) });
        showNotice(result.message);
        go('login');
      } else if (id === 'claim-form') {
        const result = await api(`/api/items/${form.dataset.itemId}/claims`, { method: 'POST', body: JSON.stringify(formObject(form)) });
        showNotice(result.message);
        go('dashboard');
      } else if (id === 'report-form') {
        const result = await api(`/api/items/${form.dataset.itemId}/reports`, { method: 'POST', body: JSON.stringify(formObject(form)) });
        showNotice(result.message);
        form.reset();
      } else if (id === 'post-form') {
        const files = form.querySelector('[name="images"]').files;
        if (files.length > 3) throw new Error(t('imageLimit'));
        const payload = new FormData(form);
        payload.delete('images');
        for (const file of files) payload.append('images', file);
        const result = await api(form.dataset.itemId ? `/api/items/${form.dataset.itemId}` : '/api/items', {
          method: form.dataset.itemId ? 'PATCH' : 'POST',
          body: payload
        });
        showNotice(result.message);
        go('dashboard');
      } else if (id === 'profile-form') {
        const data = formObject(form);
        await api('/api/me', { method: 'PATCH', body: JSON.stringify(data) });
        if (data.locale && data.locale !== state.lang) {
          state.lang = data.locale;
          savePreference('du-lf-lang', state.lang);
        }
        showNotice(tr('Profile updated.', 'প্রোফাইল হালনাগাদ হয়েছে।'));
        return renderDashboard();
      } else if (id === 'message-form') {
        const result = await api(`/api/claims/${form.dataset.claimId}/messages`, { method: 'POST', body: JSON.stringify(formObject(form)) });
        showNotice(tr('Message sent privately.', 'ব্যক্তিগত বার্তা পাঠানো হয়েছে।'));
        await renderMessages(form.dataset.claimId);
      } else if (form.matches('.review-claim-form')) {
        const result = await api(`/api/claims/${form.dataset.claimId}/review`, {
          method: 'PATCH',
          body: JSON.stringify({ decision: submitter.value, reviewNote: form.elements.reviewNote.value })
        });
        showNotice(result.message);
        return currentRoute().path.startsWith('admin') ? renderAdmin(state.adminTab) : renderDashboard();
      } else if (form.matches('.moderate-post-form')) {
        const result = await api(`/api/admin/items/${form.dataset.itemId}/moderate`, {
          method: 'PATCH',
          body: JSON.stringify({ decision: submitter.value, note: form.elements.note.value })
        });
        showNotice(result.message);
        return renderAdmin('posts');
      } else if (form.matches('.report-status-form')) {
        await api(`/api/admin/reports/${form.dataset.reportId}`, { method: 'PATCH', body: JSON.stringify(formObject(form)) });
        showNotice(tr('Report updated.', 'রিপোর্ট হালনাগাদ হয়েছে।'));
        return renderAdmin('reports');
      } else if (form.matches('.user-status-form')) {
        const result = await api(`/api/admin/users/${form.dataset.userId}/status`, { method: 'PATCH', body: JSON.stringify(formObject(form)) });
        showNotice(result.message);
        return renderAdmin('users');
      } else if (id === 'category-form') {
        await api('/api/admin/categories', { method: 'POST', body: JSON.stringify(formObject(form)) });
        showNotice(tr('Category added.', 'বিভাগ যোগ হয়েছে।'));
        return renderAdmin('categories');
      } else if (id === 'location-form') {
        const data = formObject(form);
        if (!data.parentId) delete data.parentId;
        await api('/api/admin/locations', { method: 'POST', body: JSON.stringify(data) });
        state.categories = [];
        state.locations = [];
        showNotice(tr('Location added.', 'স্থান যোগ হয়েছে।'));
        return renderAdmin('locations');
      }
    } catch (error) {
      formError(form, error);
    } finally {
      if (button && button.isConnected) button.disabled = false;
    }
  }

  async function handleClick(event) {
    const target = event.target.closest('button');
    if (!target) return;
    if (target.matches('[data-language]')) {
      state.lang = state.lang === 'en' ? 'bn' : 'en';
      savePreference('du-lf-lang', state.lang);
      await renderRoute();
    } else if (target.matches('[data-theme]')) {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
      savePreference('du-lf-theme', state.theme);
      updateHeader();
    } else if (target.matches('[data-menu-toggle]')) {
      const open = !document.body.classList.contains('menu-open');
      document.body.classList.toggle('menu-open', open);
      target.setAttribute('aria-expanded', String(open));
    } else if (target.matches('[data-page]')) {
      const search = new URLSearchParams();
      for (const [key, value] of Object.entries(state.feedFilters)) if (value) search.set(key, value);
      search.set('page', target.dataset.page);
      go(`feed?${search}`);
    } else if (target.matches('[data-dashboard-tab]')) {
      state.dashboardTab = target.dataset.dashboardTab;
      await renderDashboard();
    } else if (target.matches('[data-read-notification]')) {
      try {
        await api(`/api/notifications/${target.dataset.readNotification}/read`, { method: 'PATCH' });
        await renderDashboard();
      } catch (error) { showNotice(error.message, 'error'); }
    } else if (target.matches('[data-messages]')) {
      const section = document.createElement('section');
      section.className = 'panel';
      section.id = 'message-thread';
      target.closest('.data-row, .panel')?.after(section);
      await renderMessages(target.dataset.messages);
      section.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else if (target.matches('[data-image]')) {
      const featured = document.querySelector('#featured-image');
      if (featured) {
        featured.src = target.dataset.image;
        featured.alt = target.dataset.alt;
        document.querySelectorAll('[data-image]').forEach(button => button.setAttribute('aria-current', String(button === target)));
      }
    } else if (target.matches('[data-delete-item]')) {
      if (!window.confirm(tr('Delete this post? This cannot be undone.', 'এই পোস্ট মুছে ফেলবেন? এটি ফিরিয়ে আনা যাবে না।'))) return;
      try {
        const result = await api(`/api/items/${target.dataset.deleteItem}`, { method: 'DELETE' });
        showNotice(result.message);
        if (currentRoute().path.startsWith('item/')) go('dashboard');
        else await renderDashboard();
      } catch (error) { showNotice(error.message, 'error'); }
    } else if (target.matches('[data-toggle-category]')) {
      try {
        await api(`/api/admin/categories/${target.dataset.toggleCategory}`, {
          method: 'PATCH',
          body: JSON.stringify({ isActive: target.dataset.active !== 'true' })
        });
        await renderAdmin('categories');
      } catch (error) { showNotice(error.message, 'error'); }
    } else if (target.matches('[data-toggle-location]')) {
      try {
        await api(`/api/admin/locations/${target.dataset.toggleLocation}`, {
          method: 'PATCH',
          body: JSON.stringify({ isActive: target.dataset.active !== 'true' })
        });
        state.locations = [];
        await renderAdmin('locations');
      } catch (error) { showNotice(error.message, 'error'); }
    }
  }

  async function logout() {
    try {
      await api('/api/auth/logout', { method: 'POST' });
      state.user = null;
      updateHeader();
      showNotice(tr('You are signed out.', 'আপনি লগ আউট করেছেন।'));
      go('home');
    } catch (error) { showNotice(error.message, 'error'); }
  }

  document.addEventListener('submit', event => { handleSubmit(event); });
  document.addEventListener('click', event => {
    if (event.target.closest('[data-menu-close]')) {
      document.body.classList.remove('menu-open');
      document.querySelector('[data-menu-toggle]').setAttribute('aria-expanded', 'false');
      return;
    }
    if (event.target.closest('[data-logout]')) {
      logout();
      return;
    }
    handleClick(event);
  });
  document.addEventListener('change', event => {
    if (event.target.matches('#post-images') && event.target.files.length > 3) {
      event.target.value = '';
      showNotice(t('imageLimit'), 'error');
    }
  });
  window.addEventListener('hashchange', renderRoute);

  (async () => {
    updateHeader();
    try {
      const profile = await api('/api/me');
      state.user = profile.user;
      if (profile.user.locale && !readPreference('du-lf-lang', null)) state.lang = profile.user.locale;
    } catch (error) {
      if (error.status !== 401) console.error('Unable to restore the current account:', error.message);
    }
    try {
      updateHeader();
      await renderRoute();
    } catch (error) {
      console.error('Unable to render the current page:', error);
      renderError(error, renderRoute);
    }
  })();
})();
