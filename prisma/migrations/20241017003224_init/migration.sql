-- CreateTable
CREATE TABLE "acc_transaction" (
    "id" VARCHAR(50) NOT NULL,
    "app_id" VARCHAR(50),
    "bio_tbl_id" VARCHAR(50),
    "company_id" VARCHAR(50),
    "create_time" TIMESTAMP(6),
    "creater_code" VARCHAR(30),
    "creater_id" VARCHAR(50),
    "creater_name" VARCHAR(50),
    "op_version" INTEGER,
    "update_time" TIMESTAMP(6),
    "updater_code" VARCHAR(30),
    "updater_id" VARCHAR(50),
    "updater_name" VARCHAR(50),
    "acc_zone" VARCHAR(30),
    "acc_zone_code" VARCHAR(30),
    "area_name" VARCHAR(100),
    "capture_photo_path" VARCHAR(200),
    "card_no" VARCHAR(255),
    "dept_code" VARCHAR(100),
    "dept_name" VARCHAR(100),
    "description" VARCHAR(200),
    "dev_alias" VARCHAR(100),
    "dev_id" VARCHAR(255),
    "dev_sn" VARCHAR(30),
    "event_addr" SMALLINT,
    "event_name" VARCHAR(100),
    "event_no" SMALLINT NOT NULL,
    "event_point_id" VARCHAR(255),
    "event_point_name" VARCHAR(100),
    "event_point_type" SMALLINT,
    "event_priority" SMALLINT,
    "event_time" TIMESTAMP(6) NOT NULL,
    "last_name" VARCHAR(50),
    "log_id" INTEGER,
    "mask_flag" VARCHAR(10),
    "name" VARCHAR(50),
    "pin" VARCHAR(30),
    "reader_name" VARCHAR(100),
    "reader_state" SMALLINT,
    "temperature" VARCHAR(50),
    "trigger_cond" SMALLINT,
    "unique_key" VARCHAR(250),
    "verify_mode_name" VARCHAR(500),
    "verify_mode_no" SMALLINT,
    "vid_linkage_handle" VARCHAR(256),

    CONSTRAINT "acc_transaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Employee" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "position" TEXT NOT NULL,

    CONSTRAINT "Employee_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "uk_6b0x8u1iijbubj0jol10j9hp9" ON "acc_transaction"("unique_key");

-- CreateIndex
CREATE INDEX "acc_transaction_crt_idx" ON "acc_transaction"("create_time");

-- CreateIndex
CREATE INDEX "acc_transaction_evt_idx" ON "acc_transaction"("event_time");

-- CreateIndex
CREATE INDEX "acc_transaction_upt_idx" ON "acc_transaction"("update_time");
