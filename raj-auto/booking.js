// ===== GLOBAL STATE =====
let bookingState = {
    selectedService: null,
    selectedServicePrice: 0,
    pickupLocation: null,
    pickupCoords: null,
    garageLocation: { lat: 21.1298, lng: 73.0832 },
    garageAddress: 'Raj Auto Garage, Bardoli, Gujarat 394601, India',
    distance: 0,
    duration: 0,
    travelCharge: 0,
    totalEstimate: 0,
};

// service durations in minutes [min, max]
const serviceDurations = {
    standard: [120, 180], // 2-3 hours
    express: [60, 120], // 1-2 hours
    repair: [240, 360], // 4-6 hours
    premium: [480, 600], // 8-10 hours (full day)
};

// Admin contact (WhatsApp) - update if needed
const adminWhatsApp = '918957514343';

// ===== WHATSAPP MESSAGE BUILDER =====
function buildBookingWhatsAppMessage() {
    const orderId = document.getElementById('order-id-display')?.textContent || '#N/A';
    const placedTime = document.getElementById('timeline-ordered')?.textContent || 'N/A';
    const pickupEta = document.getElementById('pickup-eta')?.textContent || 'N/A';
    const serviceType = document.getElementById('tracking-service')?.textContent || bookingState.selectedService;
    const pickupAddr = document.getElementById('tracking-pickup')?.textContent || bookingState.pickupLocation;
    const totalAmount = document.getElementById('tracking-amount')?.textContent || '₹' + bookingState.totalEstimate;
    const serviceDur = document.getElementById('service-duration')?.textContent || 'N/A';
    const distance = bookingState.distance?.toFixed(2) || '0';
    const travelCharge = bookingState.travelCharge || '0';

    // Generate Google Maps direction link (from pickup to garage)
    const mapsLink = generateGoogleMapsLink(
        bookingState.pickupCoords.lat,
        bookingState.pickupCoords.lng,
        pickupAddr,
        bookingState.garageLocation.lat,
        bookingState.garageLocation.lng,
        'Raj Auto Garage'
    );

    // Format message with all booking details
    const message = `🚗 *NEW BOOKING ORDER*\n\n` +
        `📋 *Order ID:* ${orderId}\n` +
        `⏰ *Order Placed:* ${placedTime}\n` +
        `📍 *Pickup Location:*\n${pickupAddr}\n\n` +
        `🗺️ *Direction Link:*\n${mapsLink}\n\n` +
        `🔧 *Service Type:* ${serviceType.toUpperCase()}\n` +
        `⏱️ *Service Duration:* ${serviceDur}\n` +
        `📏 *Distance:* ${distance} km\n` +
        `💰 *Travel Charge:* ₹${travelCharge}\n` +
        `💵 *Total Amount (Travel Only):* ${totalAmount}\n` +
        `🚗 *Pickup ETA:* ${pickupEta}\n` +
        `\n📝 *Note:* Repair cost will be determined after inspection of the vehicle.\n` +
        `✅ Please confirm pickup and provide status updates.`;

    return message;
}

// ===== GENERATE GOOGLE MAPS DIRECTION LINK =====
function generateGoogleMapsLink(pickupLat, pickupLng, pickupName, garageLat, garageLng, garageName) {
    // Google Maps URL format for directions
    const mapsUrl = `https://maps.google.com/?saddr=${pickupLat},${pickupLng}&daddr=${garageLat},${garageLng}`;
    return mapsUrl;
}

 let map = null;
let pickupMarker = null;
let garageMarker = null;
let routePolyline = null;
let directionsService = null;
let directionsRenderer = null;
let pickupAutocomplete = null;

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function () {
    // Wait for Google Maps API to load
    if (window.google && window.google.maps) {
        initializeMap();
        initializeAutocomplete();
        attachEventListeners();
        loadGarageLocation();
    } else {
        // Retry after a short delay
        setTimeout(function () {
            initializeMap();
            initializeAutocomplete();
            attachEventListeners();
            loadGarageLocation();
        }, 1000);
    }
});

// ===== MAP INITIALIZATION =====
function initializeMap() {
    const mapOptions = {
        zoom: 12,
        center: { lat: 21.1298, lng: 73.0832 },
        mapTypeControl: true,
        fullscreenControl: true,
        streetViewControl: false,
    };

    map = new google.maps.Map(document.getElementById('booking-map'), mapOptions);

    // Initialize directions service
    directionsService = new google.maps.DirectionsService();
    directionsRenderer = new google.maps.DirectionsRenderer({
        map: map,
        polylineOptions: {
            strokeColor: '#667eea',
            strokeWeight: 3,
            strokeOpacity: 0.7,
        },
        suppressMarkers: false,
    });

    // Add garage marker
    garageMarker = new google.maps.Marker({
        position: bookingState.garageLocation,
        map: map,
        title: 'Raj Auto Garage',
        icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
        animation: google.maps.Animation.DROP,
    });

    // Add info window for garage
    const garageInfoWindow = new google.maps.InfoWindow({
        content: '<div style="padding: 10px; font-weight: bold;">Raj Auto Garage<br><small>Main Market Street, Bardoli</small></div>',
    });

    garageMarker.addListener('click', () => {
        garageInfoWindow.open(map, garageMarker);
    });

    // Map click zoom controls
    document.getElementById('map-zoom-in').addEventListener('click', () => {
        map.setZoom(map.getZoom() + 1);
    });

    document.getElementById('map-zoom-out').addEventListener('click', () => {
        map.setZoom(map.getZoom() - 1);
    });

    document.getElementById('map-center').addEventListener('click', centerMap);
}

// ===== GOOGLE PLACES AUTOCOMPLETE =====
function initializeAutocomplete() {
    const input = document.getElementById('pickup-location');

    const options = {
        types: ['geocode'],
        componentRestrictions: { country: 'in' },
        fields: ['formatted_address', 'geometry', 'place_id'],
    };

    pickupAutocomplete = new google.maps.places.Autocomplete(input, options);

    pickupAutocomplete.addListener('place_changed', onPlaceChanged);

    // Prevent form submission on autocomplete select
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
        }
    });
}

function onPlaceChanged() {
    const place = pickupAutocomplete.getPlace();

    if (!place.geometry) {
        console.error('No geometry found for place');
        return;
    }

    bookingState.pickupCoords = {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
    };
    bookingState.pickupLocation = place.formatted_address;

    updateMapWithPickupLocation(bookingState.pickupCoords);
    updateEstimates();

    // Enable next button
    document.getElementById('next-step-2').disabled = false;
}

// ===== LOAD GARAGE LOCATION =====
function loadGarageLocation() {
    const garageInput = document.getElementById('garage-location');
    garageInput.value = bookingState.garageAddress;
}

// ===== EVENT LISTENERS =====
function attachEventListeners() {
    // Service selection
    document.querySelectorAll('.service-option').forEach((option) => {
        option.addEventListener('click', selectService);
    });

    // Location input
    document.getElementById('use-current-location').addEventListener('click', useCurrentLocation);

    // Step navigation
    document.getElementById('next-step-1').addEventListener('click', goToStep2);
    document.getElementById('back-step-2').addEventListener('click', goToStep1);
    document.getElementById('next-step-2').addEventListener('click', goToStep3);
    document.getElementById('back-step-3').addEventListener('click', goToStep2);
    document.getElementById('confirm-order').addEventListener('click', confirmOrder);

    // Terms checkbox
    document.getElementById('agree-terms').addEventListener('change', updateConfirmButton);
}

// ===== SERVICE SELECTION =====
function selectService(e) {
    const option = e.currentTarget;

    // Deselect previous
    document.querySelectorAll('.service-option').forEach((o) => o.classList.remove('selected'));

    // Select current
    option.classList.add('selected');

    bookingState.selectedService = option.dataset.service;
    bookingState.selectedServicePrice = parseInt(option.dataset.price);

    // Enable next button
    document.getElementById('next-step-1').disabled = false;

    updateEstimates();
}


// ===== USE CURRENT LOCATION =====
function useCurrentLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                bookingState.pickupCoords = { lat: latitude, lng: longitude };

                // Reverse geocode using Google Maps
                const geocoder = new google.maps.Geocoder();
                geocoder.geocode({ location: { lat: latitude, lng: longitude } }, (results, status) => {
                    if (status === 'OK' && results[0]) {
                        const location = results[0].formatted_address;
                        document.getElementById('pickup-location').value = location;
                        bookingState.pickupLocation = location;

                        updateMapWithPickupLocation({ lat: latitude, lng: longitude });
                        updateEstimates();
                        document.getElementById('next-step-2').disabled = false;
                    } else {
                        alert('Unable to determine location address. Please enter manually.');
                    }
                });
            },
            (error) => {
                alert('Unable to access current location. Please enter manually.');
                console.error('Geolocation error:', error);
            }
        );
    } else {
        alert('Geolocation is not supported by your browser.');
    }
}

function useCurrentLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                bookingState.pickupCoords = { lat: latitude, lng: longitude };

                // Simulate reverse geocoding
                const location = `Current Location (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`;
                document.getElementById('pickup-location').value = location;
                bookingState.pickupLocation = location;

                updateMapWithPickupLocation({ lat: latitude, lng: longitude });
                updateEstimates();
                document.getElementById('next-step-2').disabled = false;
            },
            (error) => {
                alert('Unable to access current location. Please enter manually.');
            }
        );
    } else {
        alert('Geolocation is not supported by your browser.');
    }
}

// ===== UPDATE MAP WITH PICKUP LOCATION =====
function updateMapWithPickupLocation(coords) {
    if (pickupMarker) {
        pickupMarker.setMap(null);
    }

    // Add pickup marker
    pickupMarker = new google.maps.Marker({
        position: coords,
        map: map,
        title: 'Pickup Location',
        icon: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
        animation: google.maps.Animation.DROP,
    });

    // Add info window for pickup location
    const pickupInfoWindow = new google.maps.InfoWindow({
        content: '<div style="padding: 10px; font-weight: bold;">Your Location<br><small>' + bookingState.pickupLocation + '</small></div>',
    });

    pickupMarker.addListener('click', () => {
        pickupInfoWindow.open(map, pickupMarker);
    });

    // Calculate and display route
    calculateAndDisplayRoute();

    // Fit map to show both markers
    const bounds = new google.maps.LatLngBounds();
    bounds.extend(coords);
    bounds.extend(bookingState.garageLocation);
    map.fitBounds(bounds);

    // Add some padding
    setTimeout(() => {
        map.panBy(0, -100);
    }, 500);
}

// ===== CALCULATE ROUTE =====
function calculateAndDisplayRoute() {
    if (!bookingState.pickupCoords) return;

    const request = {
        origin: bookingState.pickupCoords,
        destination: bookingState.garageLocation,
        travelMode: google.maps.TravelMode.DRIVING,
    };

    directionsService.route(request, (result, status) => {
        if (status === google.maps.DirectionsStatus.OK) {
            directionsRenderer.setDirections(result);

            // Get distance and duration from the route
            const route = result.routes[0];
            const leg = route.legs[0];

            bookingState.distance = leg.distance.value / 1000; // Convert to km
            bookingState.duration = Math.ceil(leg.duration.value / 60); // Convert to minutes

            updateEstimates();
        } else {
            console.error('Directions request failed:', status);

            // Fallback: calculate distance using Haversine formula
            const haversineDistance = calculateHaversineDistance(
                bookingState.pickupCoords.lat,
                bookingState.pickupCoords.lng,
                bookingState.garageLocation.lat,
                bookingState.garageLocation.lng
            );

            bookingState.distance = haversineDistance;
            updateEstimates();
        }
    });
}

// ===== HAVERSINE DISTANCE CALCULATION (FALLBACK) =====
function calculateHaversineDistance(lat1, lng1, lat2, lng2) {
    const R = 6371; // Earth's radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLng = ((lng2 - lng1) * Math.PI) / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((lat1 * Math.PI) / 180) *
            Math.cos((lat2 * Math.PI) / 180) *
            Math.sin(dLng / 2) *
            Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}


// ===== UPDATE ESTIMATES =====
function updateEstimates() {
    if (!bookingState.pickupCoords) return;

    // Calculate travel charge: ₹15 per km
    bookingState.travelCharge = Math.ceil(bookingState.distance * 15);

    // Total estimate = ONLY travel charge (repair cost determined after inspection)
    bookingState.totalEstimate = bookingState.travelCharge;

    // Update displays
    document.getElementById('distance-display').textContent = bookingState.distance.toFixed(2) + ' km';
    document.getElementById('travel-charge-display').textContent = '₹' + bookingState.travelCharge;
    document.getElementById('total-estimate-display').textContent = '₹' + bookingState.totalEstimate + ' (Travel only)';
}

// ===== STEP NAVIGATION =====
function goToStep2() {
    if (!bookingState.selectedService) return;

    showStep(2);
    updateProgressTracker(2);
}

function goToStep1() {
    showStep(1);
    updateProgressTracker(1);
}

function goToStep3() {
    if (!bookingState.pickupLocation) {
        alert('Please select a pickup location');
        return;
    }

    updateOrderSummary();
    showStep(3);
    updateProgressTracker(3);
}

function goToStep2FromStep3() {
    showStep(2);
    updateProgressTracker(2);
}

function showStep(stepNumber) {
    document.querySelectorAll('.booking-step').forEach((step) => {
        step.classList.remove('active');
    });
    document.getElementById('step-' + stepNumber).classList.add('active');
}

function updateProgressTracker(step) {
    document.querySelectorAll('.progress-item').forEach((item) => {
        item.classList.remove('active');
    });
    document.querySelector(`[data-step="${step}"]`).classList.add('active');
}

// ===== ORDER SUMMARY =====
function updateOrderSummary() {
    document.getElementById('summary-service').textContent = bookingState.selectedService
        .charAt(0)
        .toUpperCase() + bookingState.selectedService.slice(1);
    document.getElementById('summary-pickup').textContent = bookingState.pickupLocation;
    document.getElementById('summary-garage').textContent = bookingState.garageAddress;
    document.getElementById('summary-distance').textContent = bookingState.distance.toFixed(2) + ' km';
    document.getElementById('summary-total').textContent = '₹' + bookingState.totalEstimate + ' (Travel charge only)';
}

function updateConfirmButton() {
    const agreeTerms = document.getElementById('agree-terms').checked;
    document.getElementById('confirm-order').disabled = !agreeTerms;
}

// ===== ORDER CONFIRMATION =====
function confirmOrder() {
    const orderId = 'RAJ' + String(Math.floor(Math.random() * 1000000)).padStart(6, '0');

    // Update tracking modal with order details
    document.getElementById('order-id-display').textContent = '#' + orderId;
    document.getElementById('tracking-service').textContent = bookingState.selectedService;
    document.getElementById('tracking-pickup').textContent = bookingState.pickupLocation;
    document.getElementById('tracking-amount').textContent = '₹' + bookingState.totalEstimate;
    // set ordered time
    const orderedTime = new Date();
    document.getElementById('timeline-ordered').textContent = orderedTime.toLocaleTimeString();

    // compute dynamic ETAs based on distance, travel time and service duration
    const travelMinutes = bookingState.duration || Math.ceil((bookingState.distance / 40) * 60); // fallback assuming 40 km/h avg
    // pickup ETA: when the pickup agent can reach customer (travelMinutes + buffer 5-10)
    const pickupEtaMin = travelMinutes + 5;
    const pickupEtaMax = travelMinutes + 20; // allow variability

    const serviceWindow = serviceDurations[bookingState.selectedService] || [120, 180];

    // Estimate service start time = orderedTime + pickupEtaMin minutes
    const serviceStartMin = new Date(orderedTime.getTime() + pickupEtaMin * 60000);
    const serviceStartMax = new Date(orderedTime.getTime() + pickupEtaMax * 60000);

    // Service end estimates (min and max)
    const serviceEndMin = new Date(serviceStartMin.getTime() + serviceWindow[0] * 60000);
    const serviceEndMax = new Date(serviceStartMax.getTime() + serviceWindow[1] * 60000);

    // Delivery ETA after service: assume delivery travel time similar to pickup
    const deliverEtaMin = Math.ceil((serviceEndMin.getTime() - orderedTime.getTime()) / 60000) + travelMinutes;
    const deliverEtaMax = Math.ceil((serviceEndMax.getTime() - orderedTime.getTime()) / 60000) + travelMinutes;

    // populate timeline fields
    document.getElementById('pickup-eta').textContent = `${pickupEtaMin}-${pickupEtaMax} minutes`;
    document.getElementById('service-duration').textContent = `${Math.ceil(serviceWindow[0]/60)}-${Math.ceil(serviceWindow[1]/60)} hours`;
    document.getElementById('deliver-eta').textContent = `${Math.ceil(deliverEtaMin/60)}-${Math.ceil(deliverEtaMax/60)} hours`;

    // set delivered time placeholder to service end max + travel
    const deliveredApprox = new Date(serviceEndMax.getTime() + travelMinutes * 60000);
    document.getElementById('timeline-delivered-time').textContent = deliveredApprox.toLocaleTimeString();

    // Show tracking modal
    showTrackingModal();

    // Simulate order progression
    simulateOrderProgress();

    // Send to WhatsApp (optional)
    sendWhatsAppNotification(orderId);
}

function sendWhatsAppNotification(orderId) {
    const message = encodeURIComponent(
        `Hello Raj Auto! I've booked a ${bookingState.selectedService} service (Order ID: ${orderId}). Pickup location: ${bookingState.pickupLocation}. Total: ₹${bookingState.totalEstimate}`
    );
    // You can optionally open WhatsApp if needed
    // window.open(`https://wa.me/918957514343?text=${message}`, '_blank');
}

function showTrackingModal() {
    const modal = document.getElementById('tracking-modal');
    modal.classList.add('active');
}

function closeTrackingModal() {
    const modal = document.getElementById('tracking-modal');
    modal.classList.remove('active');
}

function contactSupport() {
    const whatsappNumber = '918957514343';
    const message = encodeURIComponent('Hi, I have a question about my order.');
    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank');
}

// ===== SEND BOOKING DETAILS TO ADMIN VIA WHATSAPP =====
function sendBookingDetailsToAdmin() {
    const message = buildBookingWhatsAppMessage();
    const encodedMessage = encodeURIComponent(message);
    const waUrl = `https://wa.me/${adminWhatsApp}?text=${encodedMessage}`;
    window.open(waUrl, '_blank');
}

// ===== SIMULATE ORDER PROGRESS =====
function simulateOrderProgress() {
    let progress = 0;
    // compute realistic timings from bookingState
    const travelMinutes = bookingState.duration || Math.ceil((bookingState.distance / 40) * 60);
    const pickupDelay = travelMinutes + 5; // in minutes
    const serviceWindow = serviceDurations[bookingState.selectedService] || [120, 180];
    const serviceMin = serviceWindow[0];
    const serviceMax = serviceWindow[1];
    const deliverDelay = travelMinutes + 5; // minutes after service end

    // convert to milliseconds for simulation (scale down for demo)
    const scale = 1000; // 1 minute = 1s for demo; change to 60000 for real-time

    const stages = [
        { duration: pickupDelay * scale, percentage: 20, element: 'timeline-pickup', text: 'Picking Up Your Vehicle' },
        { duration: serviceMin * scale, percentage: 60, element: 'timeline-service', text: 'In Service' },
        { duration: deliverDelay * scale, percentage: 90, element: 'timeline-deliver', text: 'Delivering Your Vehicle' },
        { duration: 1 * scale, percentage: 100, element: 'timeline-delivered', text: 'Delivered' },
    ];

    let stageIndex = 0;

    // run stages sequentially using timeouts (so durations vary per stage)
    function runStage(i) {
        if (i >= stages.length) {
            markAllStagesComplete();
            // notify admin when booking completes
            notifyAdminOrderComplete();
            return;
        }

        const stage = stages[i];
        // Update UI immediately
        document.getElementById('progress-fill').style.width = stage.percentage + '%';
        const element = document.getElementById(stage.element);
        if (element) element.classList.add('active');
        document.getElementById('progress-text').textContent = stage.text + '...';

        setTimeout(() => runStage(i + 1), stage.duration);
    }

    runStage(0);
}

function markAllStagesComplete() {
    document.querySelectorAll('.timeline-item').forEach((item) => {
        item.classList.remove('active');
        item.classList.add('completed');
    });

    document.getElementById('progress-fill').style.width = '100%';
    document.getElementById('progress-text').textContent = 'Your vehicle has been delivered!';
    document.getElementById('timeline-delivered-time').textContent = new Date().toLocaleTimeString();
}

// ===== ADMIN NOTIFICATION =====
function notifyAdminOrderComplete() {
    // Send a WhatsApp notification to admin with order summary
    try {
        const orderId = document.getElementById('order-id-display').textContent || 'N/A';
        const msg = encodeURIComponent(`Order ${orderId} completed. Service: ${bookingState.selectedService}. Pickup: ${bookingState.pickupLocation}. Total: ₹${bookingState.totalEstimate}`);
        const waUrl = `https://wa.me/${adminWhatsApp}?text=${msg}`;
        // Open WhatsApp in new tab so admin gets notified (works if admin uses WhatsApp)
        window.open(waUrl, '_blank');
    } catch (e) {
        console.error('Failed to send admin notification', e);
    }
}

// ===== MAP CONTROLS =====
function centerMap() {
    if (pickupMarker) {
        map.setCenter(bookingState.pickupCoords);
        map.setZoom(14);
    } else {
        map.setCenter(bookingState.garageLocation);
        map.setZoom(12);
    }
}

// ===== BACK BUTTON HANDLERS =====
document.addEventListener('DOMContentLoaded', function () {
    setTimeout(function () {
        const backStep2 = document.getElementById('back-step-2');
        const backStep3 = document.getElementById('back-step-3');

        if (backStep2) {
            backStep2.addEventListener('click', goToStep1);
        }

        if (backStep3) {
            backStep3.addEventListener('click', goToStep2FromStep3);
        }
    }, 100);
});
