-- =============================================================
-- V2__datos_semilla.sql
-- Datos de prueba iniciales — mínimo 10-15 registros por tabla
-- NOTA: Las contraseñas están hasheadas con BCrypt (generados con Spring BCryptPasswordEncoder)
--   Admin123!      → $2a$10$MOzS6RMOwx.ZCYz.VApr3.W4vsjk078ZqW7S3GZy0q4M26RwqqQIS
--   Reclutador123! → $2a$10$YHCsAEvPZl7ammPg4IwQzOyrNXs7J.OfC7jJ41DOXHnkPi2.kVUK2
--   Usuario123!    → $2a$10$r3uP7dMSCfClXUxvDSogcO7giqYAyYU8Ljt.pdJHrug8ZvCzwvxe6
-- =============================================================

-- -------------------------
-- ROLES
-- -------------------------
INSERT IGNORE INTO roles (id, name) VALUES
(1, 'ROLE_USER'),
(2, 'ROLE_ADMIN'),
(3, 'ROLE_RECLUTADOR');

-- -------------------------
-- USUARIOS  (15 registros)
-- -------------------------
INSERT IGNORE INTO users (id, nombre, email, password, foto_url, telefono, activo) VALUES
-- Administrador (evaluación)
(1,  'Administrador General',  'admin@profolio.com',       '$2a$10$MOzS6RMOwx.ZCYz.VApr3.W4vsjk078ZqW7S3GZy0q4M26RwqqQIS', NULL, NULL, 1),
-- Reclutadores
(2,  'Carlos Reclutador',      'reclutador@profolio.com',  '$2a$10$YHCsAEvPZl7ammPg4IwQzOyrNXs7J.OfC7jJ41DOXHnkPi2.kVUK2', NULL, '+5215511223344', 1),
(3,  'María Fernández',        'mfernandez@empresa.com',   '$2a$10$YHCsAEvPZl7ammPg4IwQzOyrNXs7J.OfC7jJ41DOXHnkPi2.kVUK2', NULL, '+5215599887766', 1),
-- Usuarios estándar
(4,  'Ana García López',       'ana.garcia@ejemplo.com',   '$2a$10$r3uP7dMSCfClXUxvDSogcO7giqYAyYU8Ljt.pdJHrug8ZvCzwvxe6', NULL, '+5215533445566', 1),
(5,  'Luis Hernández Cruz',    'luis.hernandez@gmail.com', '$2a$10$r3uP7dMSCfClXUxvDSogcO7giqYAyYU8Ljt.pdJHrug8ZvCzwvxe6', NULL, '+5215544556677', 1),
(6,  'Sofía Martínez Pérez',   'sofia.mtz@outlook.com',    '$2a$10$r3uP7dMSCfClXUxvDSogcO7giqYAyYU8Ljt.pdJHrug8ZvCzwvxe6', NULL, NULL,             1),
(7,  'Jorge Rodríguez Soto',   'jorge.rod@hotmail.com',    '$2a$10$r3uP7dMSCfClXUxvDSogcO7giqYAyYU8Ljt.pdJHrug8ZvCzwvxe6', NULL, '+5215566778899', 1),
(8,  'Elena Gómez Ruiz',       'elena.gomez@yahoo.com',    '$2a$10$r3uP7dMSCfClXUxvDSogcO7giqYAyYU8Ljt.pdJHrug8ZvCzwvxe6', NULL, NULL,             1),
(9,  'Javier Torres Alba',     'javier.torres@gmail.com',  '$2a$10$r3uP7dMSCfClXUxvDSogcO7giqYAyYU8Ljt.pdJHrug8ZvCzwvxe6', NULL, '+5215577889900', 1),
(10, 'Valentina Morales',      'vmorales@protonmail.com',  '$2a$10$r3uP7dMSCfClXUxvDSogcO7giqYAyYU8Ljt.pdJHrug8ZvCzwvxe6', NULL, NULL,             1),
(11, 'Diego Ramírez Vega',     'diego.rv@gmail.com',       '$2a$10$r3uP7dMSCfClXUxvDSogcO7giqYAyYU8Ljt.pdJHrug8ZvCzwvxe6', NULL, '+5215588990011', 1),
(12, 'Camila Jiménez Ortiz',   'camila.jo@gmail.com',      '$2a$10$r3uP7dMSCfClXUxvDSogcO7giqYAyYU8Ljt.pdJHrug8ZvCzwvxe6', NULL, NULL,             1),
(13, 'Rodrigo Sánchez Lima',   'rodrigo.sl@outlook.com',   '$2a$10$r3uP7dMSCfClXUxvDSogcO7giqYAyYU8Ljt.pdJHrug8ZvCzwvxe6', NULL, '+5215500112233', 1),
(14, 'Isabella Vargas Cruz',   'isa.vargas@gmail.com',     '$2a$10$r3uP7dMSCfClXUxvDSogcO7giqYAyYU8Ljt.pdJHrug8ZvCzwvxe6', NULL, NULL,             1),
(15, 'Andrés Castillo Nava',   'andres.cn@hotmail.com',    '$2a$10$r3uP7dMSCfClXUxvDSogcO7giqYAyYU8Ljt.pdJHrug8ZvCzwvxe6', NULL, '+5215511223300', 1);

-- -------------------------
-- USER_ROLES
-- -------------------------
INSERT IGNORE INTO user_roles (user_id, role_id) VALUES
(1,  2), -- admin → ROLE_ADMIN
(1,  1), -- admin → ROLE_USER
(2,  3), -- Carlos → ROLE_RECLUTADOR
(2,  1), -- Carlos → ROLE_USER
(3,  3), -- María → ROLE_RECLUTADOR
(3,  1), -- María → ROLE_USER
(4,  1), -- Ana → ROLE_USER
(5,  1),
(6,  1),
(7,  1),
(8,  1),
(9,  1),
(10, 1),
(11, 1),
(12, 1),
(13, 1),
(14, 1),
(15, 1);

-- -------------------------
-- TEMPLATES  (5 registros)
-- -------------------------
INSERT IGNORE INTO templates (id, nombre, categoria, descripcion, preview_url, activo) VALUES
(1, 'Clásico Profesional', 'Profesional', 'Diseño limpio y formal, ideal para entornos corporativos.', NULL, 1),
(2, 'Moderno Creativo',    'Creativo',    'Diseño dinámico con colores llamativos, perfecto para diseñadores y creativos.', NULL, 1),
(3, 'Minimalista',         'Minimalista', 'Líneas simples y mucho espacio en blanco, enfocado en el contenido.', NULL, 1),
(4, 'Ejecutivo',           'Profesional', 'Estructura ejecutiva con secciones bien definidas para perfiles senior.', NULL, 1),
(5, 'Tech Stack',          'Tecnología',  'Diseño enfocado en habilidades técnicas, ideal para desarrolladores.', NULL, 1);

-- -------------------------
-- CVS  (12 registros)
-- -------------------------
INSERT IGNORE INTO cvs (id, user_id, template_id, titulo, nombre_contacto, titulo_profesional, linkedin_url, resumen, privacidad, vistas, color_primario, fecha_creacion, fecha_modificacion) VALUES
(1,  4,  1, 'CV Ana García',          'Ana García López',     'Contadora Pública',          'linkedin.com/in/anagarcia',     'CPA con 5 años de experiencia en auditoría y finanzas corporativas.',                         'PUBLICO',  15, '#2D6A9F', NOW(), NOW()),
(2,  5,  5, 'CV Luis Hernández',      'Luis Hernández Cruz',  'Desarrollador Full Stack',   'linkedin.com/in/luish',         'Desarrollador con experiencia en React, Spring Boot y bases de datos relacionales.',          'PUBLICO',  42, '#1DB954', NOW(), NOW()),
(3,  6,  2, 'CV Sofía Martínez',      'Sofía Martínez Pérez', 'Diseñadora UX/UI',           'linkedin.com/in/sofiamtz',      'Diseñadora con pasión por la experiencia de usuario y el diseño centrado en las personas.',   'PUBLICO',  27, '#E91E8C', NOW(), NOW()),
(4,  7,  3, 'CV Jorge Rodríguez',     'Jorge Rodríguez Soto', 'Ingeniero Civil',            'linkedin.com/in/jorgerod',      'Ing. civil con especialidad en proyectos de infraestructura y gestión de obras.',             'PUBLICO',   8, '#FF6B35', NOW(), NOW()),
(5,  8,  4, 'CV Elena Gómez',         'Elena Gómez Ruiz',     'Gerente de Marketing',       'linkedin.com/in/elenagomez',    'Especialista en marketing digital con enfoque en SEO, SEM y redes sociales.',                 'PUBLICO',  33, '#9C27B0', NOW(), NOW()),
(6,  9,  1, 'CV Javier Torres',       'Javier Torres Alba',   'Médico General',             'linkedin.com/in/javiertorres',  'Médico egresado del IMSS con rotaciones en urgencias y medicina interna.',                   'PUBLICO',   5, '#00BCD4', NOW(), NOW()),
(7,  10, 5, 'CV Valentina Morales',   'Valentina Morales',    'Data Scientist',             'linkedin.com/in/vmorales',      'Científica de datos especializada en machine learning y análisis predictivo.',                'PUBLICO',  19, '#3F51B5', NOW(), NOW()),
(8,  11, 2, 'CV Diego Ramírez',       'Diego Ramírez Vega',   'Arquitecto',                 'linkedin.com/in/diegorv',       'Arquitecto con proyectos en residencial y comercial, certificado en BIM.',                   'PRIVADO',   0, '#795548', NOW(), NOW()),
(9,  12, 3, 'CV Camila Jiménez',      'Camila Jiménez Ortiz', 'Psicóloga Organizacional',   'linkedin.com/in/camilajo',      'Psicóloga clínica y organizacional con experiencia en reclutamiento y bienestar laboral.',   'PUBLICO',  11, '#FF5722', NOW(), NOW()),
(10, 13, 4, 'CV Rodrigo Sánchez',     'Rodrigo Sánchez Lima', 'Abogado Corporativo',        'linkedin.com/in/rodrigosl',     'Abogado con maestría en derecho corporativo y experiencia en fusiones y adquisiciones.',     'PUBLICO',  22, '#607D8B', NOW(), NOW()),
(11, 14, 1, 'CV Isabella Vargas',     'Isabella Vargas Cruz', 'Nutrióloga',                 'linkedin.com/in/isavargas',     'Nutrióloga certificada con enfoque en nutrición clínica y deportiva.',                       'PUBLICO',   7, '#8BC34A', NOW(), NOW()),
(12, 15, 5, 'CV Andrés Castillo',     'Andrés Castillo Nava', 'DevOps Engineer',            'linkedin.com/in/andrescent',    'Ingeniero DevOps especializado en CI/CD, Docker, Kubernetes y cloud en AWS y GCP.',          'PUBLICO',  38, '#FFC107', NOW(), NOW());

-- -------------------------
-- CV_EXPERIENCES  (14 registros)
-- -------------------------
INSERT IGNORE INTO cv_experiences (id, cv_id, empresa, cargo, fecha_inicio, fecha_fin, descripcion, orden) VALUES
(1,  1, 'Deloitte México',         'Auditora Senior',            '2021-01-01', NULL,         'Auditoría financiera de grandes corporativos del sector manufactura.',       0),
(2,  1, 'KPMG',                    'Auditora Junior',            '2019-06-01', '2020-12-31', 'Revisión de estados financieros y cumplimiento fiscal.',                     1),
(3,  2, 'Startup Tech MX',         'Full Stack Developer',       '2022-03-01', NULL,         'Desarrollo de aplicaciones web con React y Spring Boot.',                    0),
(4,  2, 'Freelance',               'Desarrollador Web',          '2020-01-01', '2022-02-28', 'Proyectos de landing pages y APIs REST para clientes PYME.',                 1),
(5,  3, 'Agencia Pixel',           'UX/UI Designer Lead',        '2021-05-01', NULL,         'Dirección de proyectos de diseño y prototipado con Figma.',                  0),
(6,  3, 'Studio Creativo',         'Diseñadora Junior',          '2019-08-01', '2021-04-30', 'Diseño gráfico y maquetación de sitios web.',                               1),
(7,  5, 'Grupo Comercial Herdez',  'Gerente de Marketing',       '2020-02-01', NULL,         'Liderazgo de campañas digitales con ROI promedio del 230%.',                 0),
(8,  5, 'OgilvyMéxico',            'Analista de Marketing',      '2017-09-01', '2020-01-31', 'Gestión de cuentas y estrategia de contenido en redes sociales.',            1),
(9,  7, 'Bancomer',                'Data Analyst',               '2022-06-01', NULL,         'Modelos predictivos de riesgo crediticio usando Python y SQL.',               0),
(10, 7, 'ITAM',                    'Asistente de Investigación', '2021-01-01', '2022-05-31', 'Análisis estadístico de datos socioeconómicos para el INEGI.',               1),
(11, 10, 'González & Asociados',   'Abogado Senior',             '2019-03-01', NULL,         'Asesoría legal en fusiones, adquisiciones y contratos corporativos.',        0),
(12, 10, 'Bufete Jurídico MX',     'Pasante',                    '2017-08-01', '2019-02-28', 'Redacción de contratos y representación en litigios menores.',               1),
(13, 12, 'Clip',                   'DevOps Engineer',            '2021-07-01', NULL,         'Gestión de infraestructura cloud en AWS con Terraform y Kubernetes.',         0),
(14, 12, 'GBM',                    'Sysadmin',                   '2019-04-01', '2021-06-30', 'Administración de servidores Linux y pipelines CI/CD con Jenkins.',          1);

-- -------------------------
-- CV_EDUCATION  (13 registros)
-- -------------------------
INSERT IGNORE INTO cv_education (id, cv_id, institucion, titulo, anio_inicio, anio_fin, orden) VALUES
(1,  1,  'UNAM',                           'Licenciatura en Contaduría Pública',           2015, 2019, 0),
(2,  1,  'ITAM',                           'Diplomado en Finanzas Corporativas',            2020, 2021, 1),
(3,  2,  'IPN — ESCOM',                    'Ingeniería en Sistemas Computacionales',        2016, 2020, 0),
(4,  2,  'Platzi / Udemy',                 'Certificación React + Spring Boot',             2021, 2021, 1),
(5,  3,  'UIA',                            'Licenciatura en Diseño Gráfico',                2015, 2019, 0),
(6,  3,  'Google',                         'Certificado en UX Design',                      2020, 2020, 1),
(7,  4,  'TEC de Monterrey',               'Ingeniería Civil',                              2014, 2019, 0),
(8,  5,  'Universidad Iberoamericana',     'Licenciatura en Comunicación',                  2013, 2017, 0),
(9,  5,  'HubSpot Academy',               'Certificación en Inbound Marketing',             2018, 2018, 1),
(10, 7,  'ITAM',                           'Licenciatura en Matemáticas Aplicadas',         2017, 2021, 0),
(11, 7,  'Coursera / DeepLearning.AI',    'Especialización en Machine Learning',            2022, 2022, 1),
(12, 10, 'UNAM — Facultad de Derecho',    'Licenciatura en Derecho',                       2013, 2018, 0),
(13, 10, 'Universidad de Salamanca',      'Maestría en Derecho Corporativo Internacional', 2019, 2021, 1);

-- -------------------------
-- CV_SKILLS  (15 registros)
-- -------------------------
INSERT IGNORE INTO cv_skills (id, cv_id, nombre, nivel, orden) VALUES
(1,  1, 'Auditoría Financiera', 'Avanzado',     0),
(2,  1, 'Excel / Power BI',     'Avanzado',     1),
(3,  1, 'SAP FI',               'Intermedio',   2),
(4,  2, 'React.js',             'Avanzado',     0),
(5,  2, 'Spring Boot',          'Avanzado',     1),
(6,  2, 'MySQL / PostgreSQL',   'Avanzado',     2),
(7,  2, 'Docker',               'Intermedio',   3),
(8,  3, 'Figma',                'Avanzado',     0),
(9,  3, 'Adobe XD',             'Avanzado',     1),
(10, 3, 'CSS / Tailwind',       'Intermedio',   2),
(11, 5, 'Google Ads / SEO',     'Avanzado',     0),
(12, 5, 'Meta Ads',             'Avanzado',     1),
(13, 7, 'Python / Pandas',      'Avanzado',     0),
(14, 7, 'TensorFlow',           'Intermedio',   1),
(15, 12,'AWS / Terraform',      'Avanzado',     0);

-- -------------------------
-- SAVED_CVS  (10 registros — reclutadores guardando CVs)
-- -------------------------
INSERT IGNORE INTO saved_cvs (recruiter_id, cv_id, fecha_guardado) VALUES
(2, 1,  NOW()),
(2, 2,  NOW()),
(2, 3,  NOW()),
(2, 5,  NOW()),
(2, 7,  NOW()),
(3, 2,  NOW()),
(3, 4,  NOW()),
(3, 6,  NOW()),
(3, 9,  NOW()),
(3, 12, NOW());

-- -------------------------
-- NOTIFICATIONS  (10 registros)
-- -------------------------
INSERT IGNORE INTO notifications (id, user_id, tipo, mensaje, referencia_id, leido, fecha) VALUES
(1,  4,  'CV_VISTA',       'Tu CV fue visto por un reclutador.',                        1,  0, NOW()),
(2,  5,  'CV_VISTA',       'Tu CV fue visto 5 veces esta semana.',                      2,  0, NOW()),
(3,  6,  'CV_GUARDADO',    'Un reclutador guardó tu CV.',                               3,  0, NOW()),
(4,  7,  'SISTEMA',        'Recuerda completar tu perfil para más visibilidad.',         NULL, 1, NOW()),
(5,  8,  'CV_GUARDADO',    'Tu CV fue añadido a una lista de favoritos.',               5,  0, NOW()),
(6,  9,  'SISTEMA',        'Nuevo mensaje de un reclutador en tu bandeja.',             NULL, 0, NOW()),
(7,  10, 'CV_VISTA',       'Tu CV recibió 10 visitas esta semana.',                     7,  1, NOW()),
(8,  11, 'SISTEMA',        'Bienvenida a Profolio, completa tu CV para empezar.',       NULL, 0, NOW()),
(9,  12, 'CV_VISTA',       'Tu CV fue visto 20 veces.',                                 12, 0, NOW()),
(10, 1,  'SISTEMA',        'Nuevo usuario registrado en la plataforma.',                15, 1, NOW());

-- -------------------------
-- CONTACT_MESSAGES  (10 registros)
-- -------------------------
INSERT IGNORE INTO contact_messages (id, recruiter_id, cv_id, mensaje, canal_email, canal_sms, canal_whatsapp, estado, fecha_envio) VALUES
(1,  2, 1,  'Hola Ana, estamos interesados en tu perfil para un puesto de auditora senior.',        1, 0, 0, 'ENVIADO',   NOW()),
(2,  2, 2,  'Luis, tu experiencia en React es justo lo que buscamos. ¿Tienes disponibilidad?',      1, 1, 0, 'ENVIADO',   NOW()),
(3,  2, 3,  'Sofía, nos encantó tu portafolio. ¿Podemos agendar una llamada esta semana?',          1, 0, 1, 'ENVIADO',   NOW()),
(4,  2, 5,  'Elena, buscamos una Gerente de Marketing para nuestra empresa. ¿Te interesa?',         1, 0, 0, 'PENDIENTE', NOW()),
(5,  2, 7,  'Valentina, tu perfil en ciencia de datos encaja perfectamente con nuestra vacante.',   1, 1, 1, 'ENVIADO',   NOW()),
(6,  3, 2,  'Luis, tenemos una oportunidad de desarrollo backend. Favor de contactarnos.',          1, 0, 0, 'ENVIADO',   NOW()),
(7,  3, 4,  'Jorge, requirimos un ing. civil para supervisión de obra en CDMX.',                     1, 1, 0, 'ENVIADO',   NOW()),
(8,  3, 6,  'Javier, necesitamos médicos para clínica privada en Monterrey.',                       1, 0, 1, 'PENDIENTE', NOW()),
(9,  3, 9,  'Camila, buscamos psicóloga para área de RRHH. ¿Estarías interesada?',                 1, 0, 0, 'ENVIADO',   NOW()),
(10, 3, 12, 'Andrés, tenemos vacante de DevOps en empresa fintech. ¡Tu perfil es ideal!',           1, 1, 1, 'ENVIADO',   NOW());
