import type { Metadata } from "next";
import petService from "@/services/pet/pet";

type Props = {
  children: React.ReactNode;
  params: Promise<{ petId: string }>;
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ petId: string }>;
}): Promise<Metadata> {
  const { petId } = await params;
  try {
    const pet = await petService.getPetById(petId);
    if (!pet) throw new Error("Pet not found");
    return {
      title: `Chi tiết bé ${pet.name}`,
      description: `Xem chi tiết hồ sơ y tế, lịch sử tiêm phòng và nhật ký chăm sóc của bé ${pet.name} tại trang quản trị Paw Home.`,
    };
  } catch (error) {
    return {
      title: "Chi tiết thú cưng",
      description: "Xem chi tiết hồ sơ y tế, lịch sử tiêm phòng và nhật ký chăm sóc của thú cưng.",
    };
  }
}

export default function Layout({ children }: Props) {
  return <>{children}</>;
}
