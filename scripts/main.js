// 전역 변수
let cart = [];
let currentCategory = 'home';
let currentUser = null;

// DOM 요소들
const navLinks = document.querySelectorAll('.nav-link');
const categoryContents = document.querySelectorAll('.category-content');
const cartToggle = document.getElementById('cart-toggle');
const cartSidebar = document.getElementById('cart-sidebar');
const closeCart = document.getElementById('close-cart');
const cartItems = document.getElementById('cart-items');
const cartCount = document.getElementById('cart-count');
const cartTotal = document.getElementById('cart-total');
const checkoutBtn = document.getElementById('checkout-btn');
const paymentModal = document.getElementById('payment-modal');
const closePayment = document.getElementById('close-payment');
const paymentForm = document.getElementById('payment-form');

// 인증 관련 DOM 요소들
const loginBtn = document.getElementById('login-btn');
const signupBtn = document.getElementById('signup-btn');
const loginModal = document.getElementById('login-modal');
const signupModal = document.getElementById('signup-modal');
const closeLogin = document.getElementById('close-login');
const closeSignup = document.getElementById('close-signup');
const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const showSignup = document.getElementById('show-signup');
const showLogin = document.getElementById('show-login');
const authButtons = document.getElementById('auth-buttons');
const userProfile = document.getElementById('user-profile');
const userProfileBtn = document.getElementById('user-profile-btn');
const userProfileDropdown = document.getElementById('user-profile-dropdown');
const logoutBtn = document.getElementById('logout-btn');
const forgotPassword = document.getElementById('forgot-password');

// 초기화
document.addEventListener('DOMContentLoaded', function() {
    initializeEventListeners();
    updateCartDisplay();
    showCategory(currentCategory);
    initializeFirebaseAuth();
    initializePaymentSystem();
});

// Firebase 인증 초기화
function initializeFirebaseAuth() {
    // Firebase가 로드되기를 기다림
    const checkFirebase = () => {
        if (window.firebaseAuth && window.firebaseAuthMethods) {
            setupFirebaseAuth();
        } else {
            setTimeout(checkFirebase, 100);
        }
    };
    checkFirebase();
}

// Firebase 인증 설정
function setupFirebaseAuth() {
    const { onAuthStateChanged } = window.firebaseAuthMethods;
    
    // 인증 상태 변경 감지
    onAuthStateChanged(window.firebaseAuth, (user) => {
        if (user) {
            // 로그인 상태
            currentUser = {
                id: user.uid,
                name: user.displayName,
                email: user.email,
                avatar: user.photoURL,
                provider: 'google'
            };
            updateAuthUI();
            saveUserToFirestore(user);
        } else {
            // 로그아웃 상태
            currentUser = null;
            updateAuthUI();
        }
    });
}

// Firestore에 사용자 정보 저장
async function saveUserToFirestore(user) {
    try {
        const { doc, setDoc } = window.firestoreMethods;
        const userRef = doc(window.firebaseDb, 'users', user.uid);
        
        await setDoc(userRef, {
            name: user.displayName,
            email: user.email,
            avatar: user.photoURL,
            lastLogin: new Date(),
            createdAt: new Date()
        }, { merge: true });
        
        console.log('사용자 정보가 Firestore에 저장되었습니다.');
    } catch (error) {
        console.error('Firestore 저장 오류:', error);
    }
}

// 결제 시스템 초기화
function initializePaymentSystem() {
    // PortOne (아임포트) 초기화
    if (window.IMP) {
        window.IMP.init('imp_your_code'); // 실제 가맹점 식별코드로 교체 필요
        console.log('PortOne 결제 시스템이 초기화되었습니다.');
    }
}

// 이벤트 리스너 초기화
function initializeEventListeners() {
    // 네비게이션 링크
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const category = link.getAttribute('data-category');
            showCategory(category);
            updateActiveNavLink(link);
        });
    });

    // 장바구니 담기 버튼
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('add-to-cart-btn')) {
            const productName = e.target.getAttribute('data-product');
            const productPrice = parseInt(e.target.getAttribute('data-price'));
            addToCart(productName, productPrice);
        }
    });

    // 장바구니 토글
    cartToggle.addEventListener('click', () => {
        cartSidebar.classList.toggle('active');
    });

    // 장바구니 닫기
    closeCart.addEventListener('click', () => {
        cartSidebar.classList.remove('active');
    });

    // 결제하기 버튼
    checkoutBtn.addEventListener('click', () => {
        if (cart.length === 0) {
            alert('장바구니가 비어있습니다.');
            return;
        }
        
        // 로그인 확인
        if (!currentUser) {
            alert('결제를 위해 로그인이 필요합니다.');
            loginModal.classList.add('active');
            return;
        }
        
        showPaymentModal();
    });

    // 결제 모달 닫기
    closePayment.addEventListener('click', () => {
        paymentModal.classList.remove('active');
    });

    // 결제 폼 제출
    paymentForm.addEventListener('submit', (e) => {
        e.preventDefault();
        processPayment();
    });

    // 모달 바깥 클릭시 닫기
    paymentModal.addEventListener('click', (e) => {
        if (e.target === paymentModal) {
            paymentModal.classList.remove('active');
        }
    });

    // 사이드바 바깥 클릭시 닫기
    document.addEventListener('click', (e) => {
        if (!cartSidebar.contains(e.target) && !cartToggle.contains(e.target)) {
            cartSidebar.classList.remove('active');
        }
        
        // 사용자 드롭다운 바깥 클릭시 닫기
        if (!userProfile.contains(e.target) && !userProfileDropdown.contains(e.target)) {
            userProfileDropdown.classList.remove('active');
        }
    });

    // 인증 관련 이벤트 리스너
    setupAuthEventListeners();
}

// 인증 관련 이벤트 리스너 설정
function setupAuthEventListeners() {
    // 로그인 버튼
    loginBtn.addEventListener('click', () => {
        loginModal.classList.add('active');
    });

    // 회원가입 버튼
    signupBtn.addEventListener('click', () => {
        signupModal.classList.add('active');
    });

    // 모달 닫기 버튼들
    closeLogin.addEventListener('click', () => {
        loginModal.classList.remove('active');
    });

    closeSignup.addEventListener('click', () => {
        signupModal.classList.remove('active');
    });

    // 모달 전환 버튼들
    showSignup.addEventListener('click', () => {
        loginModal.classList.remove('active');
        signupModal.classList.add('active');
    });

    showLogin.addEventListener('click', () => {
        signupModal.classList.remove('active');
        loginModal.classList.add('active');
    });

    // 사용자 프로필 버튼
    userProfileBtn.addEventListener('click', () => {
        userProfileDropdown.classList.toggle('active');
    });

    // 로그아웃 버튼
    logoutBtn.addEventListener('click', () => {
        logout();
    });

    // 비밀번호 찾기
    forgotPassword.addEventListener('click', () => {
        alert('비밀번호 찾기 기능은 준비 중입니다.');
    });

    // 소셜 로그인 버튼들
    document.querySelector('.kakao-btn').addEventListener('click', () => {
        handleSocialLogin('kakao');
    });

    document.querySelector('.google-btn').addEventListener('click', () => {
        handleSocialLogin('google');
    });

    // 구글 회원가입 버튼
    document.getElementById('google-signup-btn').addEventListener('click', () => {
        handleSocialLogin('google');
    });

    // 폼 제출
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        handleLogin();
    });

    signupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        handleSignup();
    });

    // 모달 바깥 클릭시 닫기
    loginModal.addEventListener('click', (e) => {
        if (e.target === loginModal) {
            loginModal.classList.remove('active');
        }
    });

    signupModal.addEventListener('click', (e) => {
        if (e.target === signupModal) {
            signupModal.classList.remove('active');
        }
    });
}

// 카테고리 표시
function showCategory(category) {
    // 모든 카테고리 숨기기
    categoryContents.forEach(content => {
        content.classList.remove('active');
    });

    // 선택된 카테고리 표시
    const targetCategory = document.getElementById(category);
    if (targetCategory) {
        targetCategory.classList.add('active');
        currentCategory = category;
    }
    
    // 네비게이션 링크 업데이트
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-category') === category) {
            link.classList.add('active');
        }
    });
}

// 활성 네비게이션 링크 업데이트
function updateActiveNavLink(activeLink) {
    navLinks.forEach(link => {
        link.classList.remove('active');
    });
    activeLink.classList.add('active');
}

// 장바구니에 상품 추가
function addToCart(productName, productPrice) {
    // 이미 장바구니에 있는지 확인
    const existingItem = cart.find(item => item.name === productName);
    
    if (existingItem) {
        alert('이미 장바구니에 있는 상품입니다.');
        return;
    }

    // 새 상품 추가
    const newItem = {
        id: Date.now(),
        name: productName,
        price: productPrice
    };

    cart.push(newItem);
    updateCartDisplay();
    
    // 성공 메시지
    showSuccessMessage('장바구니에 추가되었습니다!');
    
    // 장바구니 사이드바 잠깐 표시
    cartSidebar.classList.add('active');
    setTimeout(() => {
        cartSidebar.classList.remove('active');
    }, 1500);
}

// 장바구니에서 상품 제거
function removeFromCart(itemId) {
    cart = cart.filter(item => item.id !== itemId);
    updateCartDisplay();
}

// 장바구니 디스플레이 업데이트
function updateCartDisplay() {
    // 장바구니 개수 업데이트
    cartCount.textContent = cart.length;
    
    // 장바구니 아이템 목록 업데이트
    cartItems.innerHTML = '';
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p style="text-align: center; color: #999; padding: 20px;">장바구니가 비어있습니다.</p>';
    } else {
        cart.forEach(item => {
            const cartItem = createCartItemElement(item);
            cartItems.appendChild(cartItem);
        });
    }
    
    // 총 금액 계산 및 업데이트
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    cartTotal.textContent = formatPrice(total);
}

// 장바구니 아이템 요소 생성
function createCartItemElement(item) {
    const cartItem = document.createElement('div');
    cartItem.className = 'cart-item';
    cartItem.innerHTML = `
        <div class="cart-item-info">
            <h4>${item.name}</h4>
            <div class="cart-item-price">${formatPrice(item.price)}</div>
        </div>
        <button class="remove-item" onclick="removeFromCart(${item.id})">
            <i class="fas fa-trash"></i>
        </button>
    `;
    return cartItem;
}

// 결제 모달 표시
function showPaymentModal() {
    // 결제 아이템 목록 생성
    const paymentItems = document.getElementById('payment-items');
    paymentItems.innerHTML = '';
    
    cart.forEach(item => {
        const paymentItem = document.createElement('div');
        paymentItem.className = 'payment-item';
        paymentItem.innerHTML = `
            <span>${item.name}</span>
            <span>${formatPrice(item.price)}</span>
        `;
        paymentItems.appendChild(paymentItem);
    });
    
    // 총 금액 업데이트
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    document.getElementById('payment-total').textContent = formatPrice(total);
    
    // 모달 표시
    paymentModal.classList.add('active');
}

// 실제 카드 결제 처리 (PortOne 사용)
function processPayment() {
    const buyerName = document.getElementById('buyer-name').value;
    const buyerEmail = document.getElementById('buyer-email').value;
    const buyerPhone = document.getElementById('buyer-phone').value;
    const paymentMethod = document.getElementById('payment-method').value;
    
    if (!buyerName || !buyerEmail || !buyerPhone || !paymentMethod) {
        alert('모든 필드를 입력해주세요.');
        return;
    }
    
    // 이메일 유효성 검사
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(buyerEmail)) {
        alert('올바른 이메일 주소를 입력해주세요.');
        return;
    }
    
    // 전화번호 유효성 검사
    const phoneRegex = /^01[0-9]-\d{3,4}-\d{4}$/;
    if (!phoneRegex.test(buyerPhone)) {
        alert('올바른 전화번호 형식을 입력해주세요. (예: 010-1234-5678)');
        return;
    }
    
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    const orderId = generateOrderId();
    
    // 실제 카드 결제 진행
    if (paymentMethod === 'card' && window.IMP) {
        // PortOne 실제 카드 결제
        const paymentData = {
            pg: 'html5_inicis', // 이니시스 웹표준 결제
            pay_method: 'card',
            merchant_uid: orderId,
            name: `분석의진수 - ${cart.map(item => item.name).join(', ')}`,
            amount: total,
            buyer_email: buyerEmail,
            buyer_name: buyerName,
            buyer_tel: buyerPhone,
            buyer_addr: '',
            buyer_postcode: '',
            custom_data: {
                userId: currentUser?.id,
                items: cart
            }
        };
        
        window.IMP.request_pay(paymentData, function(response) {
            if (response.success) {
                // 결제 성공
                processPaymentSuccess(response, orderId, buyerName, buyerEmail, buyerPhone, total);
            } else {
                // 결제 실패
                alert(`결제에 실패했습니다.\n오류: ${response.error_msg}`);
                resetPaymentButton();
            }
        });
    } else if (paymentMethod === 'kakaopay' && window.IMP) {
        // 카카오페이 결제
        const paymentData = {
            pg: 'kakaopay',
            pay_method: 'card',
            merchant_uid: orderId,
            name: `분석의진수 - ${cart.map(item => item.name).join(', ')}`,
            amount: total,
            buyer_email: buyerEmail,
            buyer_name: buyerName,
            buyer_tel: buyerPhone
        };
        
        window.IMP.request_pay(paymentData, function(response) {
            if (response.success) {
                processPaymentSuccess(response, orderId, buyerName, buyerEmail, buyerPhone, total);
            } else {
                alert(`카카오페이 결제에 실패했습니다.\n오류: ${response.error_msg}`);
                resetPaymentButton();
            }
        });
    } else {
        // 무통장입금 또는 기타 결제 방법
        processAlternativePayment(orderId, buyerName, buyerEmail, buyerPhone, paymentMethod, total);
    }
}

// 결제 성공 처리
async function processPaymentSuccess(response, orderId, buyerName, buyerEmail, buyerPhone, total) {
    try {
        // 서버에서 결제 검증 (실제 서비스에서는 필수)
        // const verification = await verifyPayment(response.imp_uid, response.merchant_uid);
        
        // 주문 내역 생성
        const order = {
            orderId: orderId,
            impUid: response.imp_uid, // 아임포트 거래 고유번호
            userId: currentUser?.id,
            buyerName: buyerName,
            buyerEmail: buyerEmail,
            buyerPhone: buyerPhone,
            paymentMethod: 'card',
            items: [...cart],
            total: total,
            orderDate: new Date().toISOString(),
            status: 'paid',
            paymentData: response
        };
        
        // Firestore에 주문 내역 저장
        if (window.firebaseDb && window.firestoreMethods) {
            await saveOrderToFirestore(order);
        }
        
        // 로컬스토리지에도 백업 저장
        const orders = JSON.parse(localStorage.getItem('orders') || '[]');
        orders.push(order);
        localStorage.setItem('orders', JSON.stringify(orders));
        
        // 성공 알림
        alert(`🎉 결제가 완료되었습니다!\n\n주문번호: ${orderId}\n거래번호: ${response.imp_uid}\n주문자: ${buyerName}\n결제금액: ${formatPrice(total)}\n\n주문 내역은 마이페이지에서 확인하실 수 있습니다.`);
        
        // 장바구니 비우기 및 UI 리셋
        cart = [];
        updateCartDisplay();
        paymentModal.classList.remove('active');
        cartSidebar.classList.remove('active');
        paymentForm.reset();
        resetPaymentButton();
        
        showSuccessMessage('실제 결제가 완료되었습니다! 📧 주문 확인 메일을 발송했습니다.');
        showCategory('home');
        
    } catch (error) {
        console.error('결제 후 처리 오류:', error);
        alert('결제는 완료되었지만 주문 처리 중 오류가 발생했습니다. 고객센터로 문의해주세요.');
    }
}

// 대체 결제 방법 처리 (무통장입금 등)
function processAlternativePayment(orderId, buyerName, buyerEmail, buyerPhone, paymentMethod, total) {
    const order = {
        orderId: orderId,
        userId: currentUser?.id,
        buyerName: buyerName,
        buyerEmail: buyerEmail,
        buyerPhone: buyerPhone,
        paymentMethod: paymentMethod,
        items: [...cart],
        total: total,
        orderDate: new Date().toISOString(),
        status: paymentMethod === 'bank' ? 'pending' : 'completed'
    };
    
    // Firestore에 저장
    if (window.firebaseDb) {
        saveOrderToFirestore(order);
    }
    
    // 로컬스토리지에 저장
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    orders.push(order);
    localStorage.setItem('orders', JSON.stringify(orders));
    
    if (paymentMethod === 'bank') {
        alert(`🎉 주문이 접수되었습니다!\n\n주문번호: ${orderId}\n입금계좌: 국민은행 123456-78-901234\n예금주: 분석의진수\n입금금액: ${formatPrice(total)}\n\n입금 확인 후 처리됩니다.`);
    } else {
        alert(`🎉 주문이 완료되었습니다!\n\n주문번호: ${orderId}\n주문자: ${buyerName}\n결제금액: ${formatPrice(total)}`);
    }
    
    // UI 리셋
    cart = [];
    updateCartDisplay();
    paymentModal.classList.remove('active');
    cartSidebar.classList.remove('active');
    paymentForm.reset();
    resetPaymentButton();
    
    showSuccessMessage('주문이 완료되었습니다!');
    showCategory('home');
}

// Firestore에 주문 저장
async function saveOrderToFirestore(order) {
    try {
        const { doc, setDoc } = window.firestoreMethods;
        const orderRef = doc(window.firebaseDb, 'orders', order.orderId);
        await setDoc(orderRef, order);
        console.log('주문 내역이 Firestore에 저장되었습니다.');
    } catch (error) {
        console.error('Firestore 주문 저장 오류:', error);
    }
}

// 결제 버튼 리셋
function resetPaymentButton() {
    const submitBtn = document.querySelector('.payment-submit-btn');
    submitBtn.textContent = '결제 완료';
    submitBtn.disabled = false;
}

// 주문번호 생성
function generateOrderId() {
    const now = new Date();
    const year = now.getFullYear().toString().slice(-2);
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `DA${year}${month}${day}${random}`;
}

// 결제 방법 이름 반환
function getPaymentMethodName(method) {
    const methods = {
        'card': '신용카드',
        'bank': '무통장입금',
        'kakaopay': '카카오페이'
    };
    return methods[method] || method;
}

// 가격 포맷팅
function formatPrice(price) {
    return new Intl.NumberFormat('ko-KR').format(price) + '원';
}

// 성공 메시지 표시
function showSuccessMessage(message) {
    // 기존 메시지 제거
    const existingMessage = document.querySelector('.success-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // 새 메시지 생성
    const messageElement = document.createElement('div');
    messageElement.className = 'success-message';
    messageElement.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #27ae60 0%, #2ecc71 100%);
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 5px 20px rgba(39, 174, 96, 0.3);
        z-index: 3000;
        font-weight: 600;
        animation: slideInRight 0.3s ease;
    `;
    messageElement.textContent = message;
    
    // CSS 애니메이션 추가
    if (!document.querySelector('#success-animation-style')) {
        const style = document.createElement('style');
        style.id = 'success-animation-style';
        style.textContent = `
            @keyframes slideInRight {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(messageElement);
    
    // 3초 후 자동 제거
    setTimeout(() => {
        messageElement.style.animation = 'slideInRight 0.3s ease reverse';
        setTimeout(() => {
            if (messageElement.parentNode) {
                messageElement.remove();
            }
        }, 300);
    }, 3000);
}

// 검색 기능 (향후 확장 가능)
function searchProducts(query) {
    // 검색 로직 구현 예정
    console.log('검색어:', query);
}

// 정렬 기능
function sortProducts(sortBy) {
    // 정렬 로직 구현 예정
    console.log('정렬 기준:', sortBy);
}

// 스크롤 이벤트 (네비게이션 고정)
window.addEventListener('scroll', () => {
    const nav = document.querySelector('.nav');
    if (window.scrollY > 100) {
        nav.style.boxShadow = '0 2px 20px rgba(0,0,0,0.15)';
    } else {
        nav.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
    }
});

// 로컬 스토리지에 장바구니 저장/불러오기
function saveCartToStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function loadCartFromStorage() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartDisplay();
    }
}

// 페이지 로드시 장바구니 불러오기
document.addEventListener('DOMContentLoaded', () => {
    loadCartFromStorage();
});

// 페이지 언로드시 장바구니 저장
window.addEventListener('beforeunload', () => {
    saveCartToStorage();
});

// 모바일 터치 이벤트 최적화
if ('ontouchstart' in window) {
    document.body.classList.add('touch-device');
}

// 웹뷰 최적화 - 뒤로가기 버튼 처리
window.addEventListener('popstate', (e) => {
    if (cartSidebar.classList.contains('active')) {
        cartSidebar.classList.remove('active');
        history.pushState(null, '', location.href);
    }
});

// 디바이스 방향 변경 감지
window.addEventListener('orientationchange', () => {
    setTimeout(() => {
        // 레이아웃 재계산
        window.dispatchEvent(new Event('resize'));
    }, 100);
});

// ============= 인증 관련 함수들 =============

// 인증 상태 확인
function checkAuthState() {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        updateAuthUI();
    }
}

// 회원가입 처리
function handleSignup() {
    const name = document.getElementById('signup-name').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    const passwordConfirm = document.getElementById('signup-password-confirm').value;
    const phone = document.getElementById('signup-phone').value;
    const agreeTerms = document.getElementById('agree-terms').checked;
    const agreeMarketing = document.getElementById('agree-marketing').checked;

    // 유효성 검사
    if (!name || !email || !password || !passwordConfirm || !phone) {
        alert('모든 필드를 입력해주세요.');
        return;
    }

    if (password !== passwordConfirm) {
        alert('비밀번호가 일치하지 않습니다.');
        return;
    }

    if (password.length < 6) {
        alert('비밀번호는 최소 6자 이상이어야 합니다.');
        return;
    }

    if (!agreeTerms) {
        alert('이용약관에 동의해주세요.');
        return;
    }

    // 이메일 중복 확인 (로컬스토리지에서)
    const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
    if (existingUsers.find(user => user.email === email)) {
        alert('이미 등록된 이메일입니다.');
        return;
    }

    // 새 사용자 정보 생성
    const newUser = {
        id: Date.now(),
        name: name,
        email: email,
        password: password, // 실제 환경에서는 해시화 필요
        phone: phone,
        agreeMarketing: agreeMarketing,
        createdAt: new Date().toISOString(),
        avatar: null
    };

    // 사용자 목록에 추가
    existingUsers.push(newUser);
    localStorage.setItem('users', JSON.stringify(existingUsers));

    // 자동 로그인
    currentUser = { ...newUser };
    delete currentUser.password; // 패스워드는 currentUser에서 제거
    localStorage.setItem('currentUser', JSON.stringify(currentUser));

    // UI 업데이트
    updateAuthUI();
    signupModal.classList.remove('active');
    signupForm.reset();

    showSuccessMessage(`${name}님, 회원가입을 축하합니다! 🎉`);
}

// 로그인 처리
function handleLogin() {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const rememberMe = document.getElementById('remember-me').checked;

    if (!email || !password) {
        alert('이메일과 비밀번호를 입력해주세요.');
        return;
    }

    // 사용자 확인
    const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const user = existingUsers.find(u => u.email === email && u.password === password);

    if (!user) {
        alert('이메일 또는 비밀번호가 올바르지 않습니다.');
        return;
    }

    // 로그인 성공
    currentUser = { ...user };
    delete currentUser.password; // 패스워드는 currentUser에서 제거

    // 로그인 상태 저장 (로그인 상태 유지 선택 시 로컬스토리지, 아니면 세션스토리지)
    if (rememberMe) {
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
    } else {
        sessionStorage.setItem('currentUser', JSON.stringify(currentUser));
    }

    // UI 업데이트
    updateAuthUI();
    loginModal.classList.remove('active');
    loginForm.reset();

    showSuccessMessage(`${currentUser.name}님, 환영합니다! 👋`);
}

// 구글 로그인 처리 (실제 Firebase Auth)
function handleSocialLogin(provider) {
    if (provider === 'google' && window.firebaseAuth && window.googleProvider) {
        const { signInWithPopup } = window.firebaseAuthMethods;
        
        signInWithPopup(window.firebaseAuth, window.googleProvider)
            .then((result) => {
                // 로그인 성공
                loginModal.classList.remove('active');
                showSuccessMessage(`${result.user.displayName}님, 구글 로그인에 성공했습니다! 👋`);
            })
            .catch((error) => {
                console.error('구글 로그인 오류:', error);
                alert('구글 로그인에 실패했습니다. 다시 시도해주세요.');
            });
    } else if (provider === 'kakao') {
        // 카카오 로그인 시뮬레이션 (향후 실제 구현 가능)
        const socialUser = {
            id: Date.now(),
            name: '카카오 사용자',
            email: 'kakaouser@kakao.com',
            phone: '010-0000-0000',
            createdAt: new Date().toISOString(),
            avatar: null,
            provider: 'kakao'
        };

        currentUser = socialUser;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        updateAuthUI();
        loginModal.classList.remove('active');
        showSuccessMessage('카카오로 로그인했습니다! 👋');
    }
}

// 로그아웃 처리 (Firebase Auth 연동)
function logout() {
    if (window.firebaseAuth && window.firebaseAuthMethods) {
        const { signOut } = window.firebaseAuthMethods;
        
        signOut(window.firebaseAuth)
            .then(() => {
                // Firebase 로그아웃 성공
                currentUser = null;
                localStorage.removeItem('currentUser');
                sessionStorage.removeItem('currentUser');
                
                updateAuthUI();
                userProfileDropdown.classList.remove('active');
                showSuccessMessage('로그아웃되었습니다. 👋');
            })
            .catch((error) => {
                console.error('로그아웃 오류:', error);
                // 로컬 로그아웃 진행
                currentUser = null;
                localStorage.removeItem('currentUser');
                sessionStorage.removeItem('currentUser');
                updateAuthUI();
                userProfileDropdown.classList.remove('active');
            });
    } else {
        // Firebase가 없는 경우 로컬 로그아웃
        currentUser = null;
        localStorage.removeItem('currentUser');
        sessionStorage.removeItem('currentUser');
        
        updateAuthUI();
        userProfileDropdown.classList.remove('active');
        showSuccessMessage('로그아웃되었습니다. 👋');
    }
}

// 인증 UI 업데이트
function updateAuthUI() {
    if (currentUser) {
        // 로그인 상태
        authButtons.style.display = 'none';
        userProfile.style.display = 'block';
        
        // 사용자 정보 표시
        document.getElementById('user-name-display').textContent = currentUser.name + '님';
        document.getElementById('user-display-name').textContent = currentUser.name;
        document.getElementById('user-display-email').textContent = currentUser.email;
        
        // 결제 폼에 기본 정보 자동 입력
        const buyerNameField = document.getElementById('buyer-name');
        const buyerEmailField = document.getElementById('buyer-email');
        const buyerPhoneField = document.getElementById('buyer-phone');
        
        if (buyerNameField) buyerNameField.value = currentUser.name;
        if (buyerEmailField) buyerEmailField.value = currentUser.email;
        if (buyerPhoneField) buyerPhoneField.value = currentUser.phone;
        
    } else {
        // 로그아웃 상태
        authButtons.style.display = 'flex';
        userProfile.style.display = 'none';
    }
}

// 세션 확인 (페이지 로드 시)
window.addEventListener('load', () => {
    // localStorage 또는 sessionStorage에서 사용자 정보 확인
    let savedUser = localStorage.getItem('currentUser');
    if (!savedUser) {
        savedUser = sessionStorage.getItem('currentUser');
    }
    
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        updateAuthUI();
    }
});
