import "dotenv/config";
import prisma from "../src/lib/prisma";

async function main() {
  const email = process.env.ADMIN_EMAIL;

  if (!email) {
    throw new Error("ADMIN_EMAIL belum diisi di .env");
  }

  const admin = await prisma.user.update({
    where: {
      email,
    },
    data: {
      role: "admin",
      status: "Aktif",
      profileFilled: true,
      emailVerified: true,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
    },
  });

  console.log("Admin berhasil diset:");
  console.log(admin);
}

main()
  .catch((error) => {
    console.error("Gagal set admin:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
