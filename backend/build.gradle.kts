plugins {
    java
    id("org.springframework.boot") version "3.4.1"
    id("io.spring.dependency-management") version "1.1.7"
}

group = "com.example"
version = "0.0.1-SNAPSHOT"

java {
    toolchain {
        languageVersion = JavaLanguageVersion.of(21)
    }
}

configurations {
    compileOnly {
        extendsFrom(configurations.annotationProcessor.get())
    }
}

repositories {
    mavenCentral()
}

dependencies {
    implementation("org.springframework.boot:spring-boot-starter-web")
    implementation("org.springframework.boot:spring-boot-starter-data-jpa")
    implementation("org.springframework.boot:spring-boot-starter-validation")
    implementation("org.flywaydb:flyway-core")
    implementation("org.flywaydb:flyway-database-postgresql")
    compileOnly("org.projectlombok:lombok")
    developmentOnly("org.springframework.boot:spring-boot-devtools")
    runtimeOnly("org.postgresql:postgresql")
    annotationProcessor("org.projectlombok:lombok")
    testImplementation("org.springframework.boot:spring-boot-starter-test")
    testRuntimeOnly("org.junit.platform:junit-platform-launcher")
}

tasks.withType<Test> {
    useJUnitPlatform()
}

// ポート 8080 を占有しているプロセスを停止してから bootRun を実行するタスク
tasks.register("bootRunSafe") {
    group = "application"
    description = "Kill any process on port 8080, then run bootRun"
    doFirst {
        val port = 8080
        try {
            val result = Runtime.getRuntime().exec(
                arrayOf("powershell", "-Command",
                    "Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue | " +
                    "Select-Object -ExpandProperty OwningProcess | " +
                    "ForEach-Object { Stop-Process -Id \$_ -Force -ErrorAction SilentlyContinue }")
            )
            result.waitFor()
            Thread.sleep(1500)
            println("Port $port cleared.")
        } catch (e: Exception) {
            println("Could not clear port $port: ${e.message}")
        }
    }
    finalizedBy("bootRun")
}
