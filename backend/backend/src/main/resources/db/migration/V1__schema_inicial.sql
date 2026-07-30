-- =============================================================
-- V1__schema_inicial.sql
-- Schema completo de Profolio
-- Gestionado por Flyway
-- =============================================================

-- -------------------------
-- TABLA: roles
-- -------------------------
CREATE TABLE IF NOT EXISTS roles (
    id   BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(30) NOT NULL UNIQUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -------------------------
-- TABLA: users
-- -------------------------
CREATE TABLE IF NOT EXISTS users (
    id       BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre   VARCHAR(100) NOT NULL,
    email    VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    foto_url VARCHAR(255),
    telefono VARCHAR(20),
    activo   TINYINT(1)  NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -------------------------
-- TABLA: user_roles  (N:M)
-- -------------------------
CREATE TABLE IF NOT EXISTS user_roles (
    user_id BIGINT NOT NULL,
    role_id BIGINT NOT NULL,
    PRIMARY KEY (user_id, role_id),
    CONSTRAINT fk_ur_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    CONSTRAINT fk_ur_role FOREIGN KEY (role_id) REFERENCES roles (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -------------------------
-- TABLA: templates
-- -------------------------
CREATE TABLE IF NOT EXISTS templates (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre      VARCHAR(100) NOT NULL,
    categoria   VARCHAR(50),
    descripcion TEXT,
    preview_url VARCHAR(255),
    activo      TINYINT(1)  NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -------------------------
-- TABLA: cvs
-- -------------------------
CREATE TABLE IF NOT EXISTS cvs (
    id                BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id           BIGINT       NOT NULL,
    template_id       BIGINT,
    titulo            VARCHAR(150) NOT NULL,
    nombre_contacto   VARCHAR(100),
    titulo_profesional VARCHAR(150),
    linkedin_url      VARCHAR(255),
    resumen           TEXT,
    privacidad        VARCHAR(20)  NOT NULL DEFAULT 'PUBLICO',
    vistas            INT          NOT NULL DEFAULT 0,
    color_primario    VARCHAR(30),
    fecha_creacion    DATETIME     NOT NULL,
    fecha_modificacion DATETIME,
    CONSTRAINT fk_cv_user     FOREIGN KEY (user_id)     REFERENCES users     (id) ON DELETE CASCADE,
    CONSTRAINT fk_cv_template FOREIGN KEY (template_id) REFERENCES templates (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -------------------------
-- TABLA: cv_experiences
-- -------------------------
CREATE TABLE IF NOT EXISTS cv_experiences (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    cv_id       BIGINT       NOT NULL,
    empresa     VARCHAR(150) NOT NULL,
    cargo       VARCHAR(150) NOT NULL,
    fecha_inicio DATE,
    fecha_fin    DATE,
    descripcion  TEXT,
    orden        INT          NOT NULL DEFAULT 0,
    CONSTRAINT fk_exp_cv FOREIGN KEY (cv_id) REFERENCES cvs (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -------------------------
-- TABLA: cv_education
-- -------------------------
CREATE TABLE IF NOT EXISTS cv_education (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    cv_id       BIGINT       NOT NULL,
    institucion VARCHAR(150) NOT NULL,
    titulo      VARCHAR(150) NOT NULL,
    anio_inicio INT,
    anio_fin    INT,
    orden       INT          NOT NULL DEFAULT 0,
    CONSTRAINT fk_edu_cv FOREIGN KEY (cv_id) REFERENCES cvs (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -------------------------
-- TABLA: cv_skills
-- -------------------------
CREATE TABLE IF NOT EXISTS cv_skills (
    id     BIGINT AUTO_INCREMENT PRIMARY KEY,
    cv_id  BIGINT      NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    nivel  VARCHAR(50),
    orden  INT          NOT NULL DEFAULT 0,
    CONSTRAINT fk_skill_cv FOREIGN KEY (cv_id) REFERENCES cvs (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -------------------------
-- TABLA: saved_cvs  (N:M reclutador — cv)
-- -------------------------
CREATE TABLE IF NOT EXISTS saved_cvs (
    recruiter_id  BIGINT   NOT NULL,
    cv_id         BIGINT   NOT NULL,
    fecha_guardado DATETIME NOT NULL,
    PRIMARY KEY (recruiter_id, cv_id),
    CONSTRAINT fk_saved_recruiter FOREIGN KEY (recruiter_id) REFERENCES users (id) ON DELETE CASCADE,
    CONSTRAINT fk_saved_cv        FOREIGN KEY (cv_id)        REFERENCES cvs  (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -------------------------
-- TABLA: password_reset_tokens
-- -------------------------
CREATE TABLE IF NOT EXISTS password_reset_tokens (
    id         BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id    BIGINT       NOT NULL,
    token      VARCHAR(255) NOT NULL UNIQUE,
    expiracion DATETIME     NOT NULL,
    usado      TINYINT(1)   NOT NULL DEFAULT 0,
    CONSTRAINT fk_prt_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -------------------------
-- TABLA: notifications
-- -------------------------
CREATE TABLE IF NOT EXISTS notifications (
    id           BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id      BIGINT       NOT NULL,
    tipo         VARCHAR(50),
    mensaje      VARCHAR(255) NOT NULL,
    referencia_id BIGINT,
    leido        TINYINT(1)   NOT NULL DEFAULT 0,
    fecha        DATETIME     NOT NULL,
    CONSTRAINT fk_notif_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -------------------------
-- TABLA: contact_messages
-- -------------------------
CREATE TABLE IF NOT EXISTS contact_messages (
    id             BIGINT AUTO_INCREMENT PRIMARY KEY,
    recruiter_id   BIGINT      NOT NULL,
    cv_id          BIGINT      NOT NULL,
    mensaje        TEXT        NOT NULL,
    canal_email    TINYINT(1)  NOT NULL DEFAULT 0,
    canal_sms      TINYINT(1)  NOT NULL DEFAULT 0,
    canal_whatsapp TINYINT(1)  NOT NULL DEFAULT 0,
    estado         VARCHAR(20) NOT NULL DEFAULT 'PENDIENTE',
    fecha_envio    DATETIME    NOT NULL,
    CONSTRAINT fk_cm_recruiter FOREIGN KEY (recruiter_id) REFERENCES users (id) ON DELETE CASCADE,
    CONSTRAINT fk_cm_cv        FOREIGN KEY (cv_id)        REFERENCES cvs  (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
