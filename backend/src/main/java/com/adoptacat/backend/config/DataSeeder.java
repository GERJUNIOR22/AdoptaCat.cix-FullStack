package com.adoptacat.backend.config;

import com.adoptacat.backend.model.Cat;
import com.adoptacat.backend.repository.CatRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
public class DataSeeder implements CommandLineRunner {

        private final CatRepository catRepository;

        public DataSeeder(CatRepository catRepository) {
                this.catRepository = catRepository;
        }

        @Override
        public void run(String... args) throws Exception {
                seedCats();
        }

        private void seedCats() {
                createCatIfNotExist("Luna", "Doméstico Pelo Corto", 2, 24, "Juguetona y Cariñosa",
                                "assets/gatos/miel.webp",
                                "Luna es una gatita muy especial que ama jugar y recibir caricias. Es perfecta para familias con niños y se lleva bien con otros gatos.",
                                false, true, true, Cat.Gender.FEMALE);

                createCatIfNotExist("Oliver", "Atigrado", 3, 36, "Tranquilo y Gentil", "assets/gatos/milaneso.webp",
                                "Oliver es un gato maduro y tranquilo. Le encanta tomar siestas al sol y es muy cariñoso con sus humanos. Ideal para personas que buscan un compañero relajado.",
                                false, true, true, Cat.Gender.MALE);

                createCatIfNotExist("Milo", "Siamés Mestizo", 1, 12, "Curioso y Vocal", "assets/gatos/gatofondo.webp",
                                "Milo es un joven aventurero que ama explorar y \"conversar\" con sus humanos. Es muy inteligente y aprende rápido.",
                                false, true, true, Cat.Gender.MALE);

                createCatIfNotExist("Bella", "Calicó", 4, 48, "Independiente y Dulce",
                                "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
                                "Bella es una gata independiente que disfruta de su espacio pero también ama los momentos de cariño. Es perfecta para personas que respetan su personalidad única.",
                                false, true, true, Cat.Gender.FEMALE);

                createCatIfNotExist("Simba", "Naranja Atigrado", 2, 24, "Aventurero y Leal",
                                "https://images.unsplash.com/photo-1573865526739-10659fec78a5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
                                "Simba es un gato valiente y leal que ama la aventura. Es muy apegado a sus humanos y siempre está listo para una nueva experiencia.",
                                false, true, true, Cat.Gender.MALE);

                createCatIfNotExist("Nala", "Gris Doméstico", 3, 36, "Elegante y Cariñosa",
                                "https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
                                "Nala es una gata elegante y sofisticada. Le encanta ser el centro de atención y es increíblemente cariñosa con las personas que conoce.",
                                false, true, true, Cat.Gender.FEMALE);

                createCatIfNotExist("Pelusa", "Mestizo", 0, 3, "Juguetona y Curiosa", "assets/gatos/pelusa-kitten.webp",
                                "Pelusa es una gatita de 3 meses llena de energía. Le encanta perseguir juguetes y descubrir nuevos rincones.",
                                false, true, false, Cat.Gender.FEMALE);

                System.out.println("Cats seeded successfully!");
        }

        private void createCatIfNotExist(String name, String breed, int age, int edadMeses, String personality,
                        String imageUrl, String description,
                        boolean isSpecialNeeds, boolean isVaccinated, boolean isSterilized, Cat.Gender gender) {
                if (!catRepository.existsByName(name)) {
                        Cat cat = new Cat();
                        cat.setId(UUID.randomUUID().toString());
                        cat.setName(name);
                        cat.setBreed(breed);
                        cat.setAge(age);
                        cat.setEdadMeses(edadMeses);
                        cat.setPersonality(personality);
                        cat.setMainImageUrl(imageUrl);
                        cat.setDescription(description);
                        cat.setIsSpecialNeeds(isSpecialNeeds);
                        cat.setIsVaccinated(isVaccinated);
                        cat.setIsSterilized(isSterilized);
                        cat.setGender(gender);
                        cat.setAdoptionStatus(Cat.AdoptionStatus.AVAILABLE);
                        cat.setFeatured(true);
                        catRepository.save(cat);
                        System.out.println("Seeded cat: " + name);
                }
        }
}
