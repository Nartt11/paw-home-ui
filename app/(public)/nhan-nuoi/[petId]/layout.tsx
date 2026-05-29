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

    const speciesLabel =
      pet.species === "DOG"
        ? "chó"
        : pet.species === "CAT"
          ? "mèo"
          : "thú cưng";
    const breedLabel = pet.breed ? ` giống ${pet.breed}` : "";
    const descriptionText = `Nhận nuôi bé ${pet.name} (${speciesLabel}${breedLabel}). Bé đang được nuôi dưỡng tại trung tâm, sẵn sàng tìm một gia đình mới đầy yêu thương tại Paw Home.`;

    return {
      title: `Nhận nuôi bé ${pet.name}`,
      description: descriptionText,
      openGraph: {
        images: pet.imageUrls && pet.imageUrls[0] ? [pet.imageUrls[0]] : [],
      },
    };
  } catch (error) {
    return {
      title: "Thông tin nhận nuôi thú cưng",
      description: "Xem chi tiết hồ sơ nhận nuôi thú cưng tại hệ thống cứu trợ Paw Home.",
    };
  }
}

export default function Layout({ children }: Props) {
  return <>{children}</>;
}
