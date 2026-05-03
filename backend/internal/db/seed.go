package db

import (
	"context"
	"time"

	"github.com/muhammedjishinjamal/choc/backend/internal/models"
	"github.com/rs/zerolog/log"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo/options"
	"golang.org/x/crypto/bcrypt"
)

func SeedDefaultUsers(db *MongoClient) error {
	collection := db.Database.Collection("users")

	users := []struct {
		email    string
		password string
		role     models.Role
	}{
		{
			email:    "superadmin@choc.com",
			password: "admin123",
			role:     models.RoleSuperAdmin,
		},
		{
			email:    "admin@choc.com",
			password: "admin123",
			role:     models.RoleAdmin,
		},
	}

	for _, u := range users {
		hashedPassword, err := bcrypt.GenerateFromPassword([]byte(u.password), bcrypt.DefaultCost)
		if err != nil {
			return err
		}

		filter := bson.M{"email": u.email}
		update := bson.M{
			"$set": bson.M{
				"email":      u.email,
				"password":   string(hashedPassword),
				"role":       u.role,
				"updated_at": time.Now(),
			},
			"$setOnInsert": bson.M{
				"created_at": time.Now(),
			},
		}

		opts := options.Update().SetUpsert(true)
		_, err = collection.UpdateOne(context.Background(), filter, update, opts)
		if err != nil {
			return err
		}
		log.Info().
			Str("email", u.email).
			Str("role", string(u.role)).
			Msg("Default user seeded/updated successfully")
	}

	return nil
}
func SeedProducts(db *MongoClient) error {
	collection := db.Database.Collection("products")

	products := []models.Product{
		{
			Name:        "Noir Eclipse",
			Category:    "Truffles",
			Price:       45.00,
			Stock:       120,
			Description: "An intense 85% dark chocolate ganache, hand-rolled and dusted with volcanic cocoa and 24K edible gold leaf.",
			Images:      []string{"https://jabal-al-ayham-data.s3.ap-south-1.amazonaws.com/seed_assets/noir_eclipse.png"},
			Videos:      []string{},
			Details: []models.ProductDetail{
				{Title: "Contents & Composition", Content: "Single-origin 85% Dark Cacao, Organic Cocoa Butter, Raw Cane Sugar, Volcanic Cocoa Dust, 24K Edible Gold Leaf. May contain traces of forest nuts."},
				{Title: "Storage & Care", Content: "Keep in a cool, dry atelier environment between 16-18°C. Avoid direct sunlight and strong aromas."},
				{Title: "Shipping & Presentation", Content: "Conveyed in temperature-controlled sustainable packaging. Please allow 24-48h for artisan preparation."},
			},
			OriginsCraft: []models.CraftBlock{
				{Type: "mixed", Title: "Volcanic Cacao Terroir", Tag: "THE ORIGIN", Content: "Harvested from remote volcanic slopes, our cacao beans absorb the mineral richness of the earth, resulting in a profile of deep smoke and wild berry notes that define the Noir Eclipse experience.", Image: "https://jabal-al-ayham-data.s3.ap-south-1.amazonaws.com/seed_assets/editorial_cacao.png"},
				{Type: "mixed", Title: "The Alchemy of Dark", Tag: "THE CRAFT", Content: "In our atelier, the raw beans undergo a precise 72-hour conching process. This ritual of time and temperature transforms the volcanic minerals into a silk-textured masterpiece of profound intensity.", Image: "https://jabal-al-ayham-data.s3.ap-south-1.amazonaws.com/seed_assets/editorial_craft.png"},
			},
			CreatedAt: time.Now(),
			UpdatedAt: time.Now(),
		},
		{
			Name:        "Midnight Sea Salt",
			Category:    "Truffles",
			Price:       42.00,
			Stock:       150,
			Description: "Velvety dark chocolate truffles infused with charcoal-smoked sea salt crystals for a profound sensory contrast.",
			Images:      []string{"https://jabal-al-ayham-data.s3.ap-south-1.amazonaws.com/seed_assets/midnight_salt.png"},
			Videos:      []string{},
			Details: []models.ProductDetail{
				{Title: "Contents & Composition", Content: "70% Dark Cacao, Maldon Smoked Sea Salt, Organic Cream, Vanilla Bean. Contains Dairy."},
				{Title: "Storage & Care", Content: "Preserve in a low-humidity environment to maintain the crystalline structure of the salt."},
				{Title: "Shipping & Presentation", Content: "Express climate-stable transit recommended."},
			},
			OriginsCraft: []models.CraftBlock{
				{Type: "mixed", Title: "The Salinity Ritual", Tag: "PROVENANCE", Content: "We utilize charcoal-smoked crystals harvested from ancient coastal salt pans. The sharp salinity pierces the rich ganache, creating a symphony of sensory peaks and valleys.", Image: "https://jabal-al-ayham-data.s3.ap-south-1.amazonaws.com/seed_assets/editorial_cacao.png"},
			},
			CreatedAt: time.Now(),
			UpdatedAt: time.Now(),
		},
		{
			Name:        "Saffron Silk",
			Category:    "Ganache",
			Price:       55.00,
			Stock:       85,
			Description: "Velvety white chocolate infused with rare Persian saffron threads and a hint of wild mountain honey.",
			Images:      []string{"https://jabal-al-ayham-data.s3.ap-south-1.amazonaws.com/seed_assets/saffron_silk.png"},
			Videos:      []string{},
			Details: []models.ProductDetail{
				{Title: "Contents & Composition", Content: "Premium Ivory Cacao Butter, Whole Milk Solids, Rare Persian Saffron Threads, Wild Mountain Honey, Pure Vanilla Bean. Contains Dairy."},
				{Title: "Storage & Care", Content: "Highly sensitive to temperature. Best preserved in its original silk-lined box at a constant 17°C."},
				{Title: "Shipping & Presentation", Content: "Express white-glove delivery within the UAE to preserve the delicate aromatic profile of the saffron."},
			},
			OriginsCraft: []models.CraftBlock{
				{Type: "mixed", Title: "Persian Red Gold", Tag: "INGREDIENTS", Content: "Rare saffron threads are hand-plucked at dawn and infused into our white chocolate ganache for exactly forty-eight hours to achieve the perfect silk texture and golden hue.", Image: "https://jabal-al-ayham-data.s3.ap-south-1.amazonaws.com/seed_assets/editorial_honey.png"},
			},
			CreatedAt: time.Now(),
			UpdatedAt: time.Now(),
		},
		{
			Name:        "Amber Nectar",
			Category:    "Ganache",
			Price:       48.00,
			Stock:       95,
			Description: "Honey-gold ganache encased in a thin white chocolate shell, capturing the essence of a sun-drenched meadow.",
			Images:      []string{"https://jabal-al-ayham-data.s3.ap-south-1.amazonaws.com/seed_assets/amber_nectar.png"},
			Videos:      []string{},
			Details: []models.ProductDetail{
				{Title: "Contents & Composition", Content: "Raw Forest Honey, White Cacao Shell, Organic Cream, Pollen Dust. Contains Dairy."},
				{Title: "Storage & Care", Content: "Avoid refrigeration; store in a curated cool-cabinet."},
				{Title: "Shipping & Presentation", Content: "Standard luxury packaging."},
			},
			OriginsCraft: []models.CraftBlock{
				{Type: "mixed", Title: "Wild Mountain Apiary", Tag: "THE SOURCE", Content: "Our honey is sourced from remote mountain hives, where the bees forage on wild jasmine and desert roses, imparting a unique floral profile to the amber ganache heart.", Image: "https://jabal-al-ayham-data.s3.ap-south-1.amazonaws.com/seed_assets/editorial_honey.png"},
			},
			CreatedAt: time.Now(),
			UpdatedAt: time.Now(),
		},
		{
			Name:        "Emerald Pistachio",
			Category:    "Ganache",
			Price:       52.00,
			Stock:       110,
			Description: "Vibrant Sicilian pistachio paste blended with white chocolate ganache, topped with hand-crushed emerald nuts.",
			Images:      []string{"https://jabal-al-ayham-data.s3.ap-south-1.amazonaws.com/seed_assets/emerald_pistachio.png"},
			Videos:      []string{},
			Details: []models.ProductDetail{
				{Title: "Contents & Composition", Content: "Sicilian Pistachios, White Chocolate, Nut Oils, Sea Salt. Contains Nuts and Dairy."},
				{Title: "Storage & Care", Content: "Maintain at 18°C for optimal texture and flavor release."},
				{Title: "Shipping & Presentation", Content: "International-grade protective packaging."},
			},
			OriginsCraft: []models.CraftBlock{
				{Type: "mixed", Title: "The Crushing Ritual", Tag: "PROVENANCE", Content: "Every pistachio is inspected for color and oil content before being slow-roasted and hand-crushed to preserve its vibrant green hue and buttery texture.", Image: "https://jabal-al-ayham-data.s3.ap-south-1.amazonaws.com/seed_assets/editorial_craft.png"},
			},
			CreatedAt: time.Now(),
			UpdatedAt: time.Now(),
		},
		{
			Name:        "Heritage Medjool",
			Category:    "Pralines",
			Price:       35.00,
			Stock:       200,
			Description: "Premium organic Medjool dates stuffed with slow-roasted almond praline and dipped in silk-textured milk chocolate.",
			Images:      []string{"https://jabal-al-ayham-data.s3.ap-south-1.amazonaws.com/seed_assets/heritage_medjool.png"},
			Videos:      []string{},
			Details: []models.ProductDetail{
				{Title: "Contents & Composition", Content: "Organic Grade-A Medjool Dates, Slow-Roasted Valencia Almonds, 45% Milk Chocolate, Sea Salt Crystals. Contains Nuts and Dairy."},
				{Title: "Storage & Care", Content: "Store in an airtight container to preserve the crispness of the almond praline center."},
				{Title: "Shipping & Presentation", Content: "Standard luxury packaging. Resilient to ambient transit."},
			},
			OriginsCraft: []models.CraftBlock{
				{Type: "mixed", Title: "Ancient Cultivation", Tag: "THE SOURCE", Content: "Our dates are harvested from centuries-old groves, where the desert sun concentrates the natural sugars into a deep, caramel-like richness that anchors the praline heart.", Image: "https://jabal-al-ayham-data.s3.ap-south-1.amazonaws.com/seed_assets/editorial_palms.png"},
			},
			CreatedAt: time.Now(),
			UpdatedAt: time.Now(),
		},
		{
			Name:        "Velvet Rose",
			Category:    "Pralines",
			Price:       38.00,
			Stock:       130,
			Description: "Rose-water infused praline with a delicate floral heart, garnished with dried damask rose petals.",
			Images:      []string{"https://jabal-al-ayham-data.s3.ap-south-1.amazonaws.com/seed_assets/velvet_rose.png"},
			Videos:      []string{},
			Details: []models.ProductDetail{
				{Title: "Contents & Composition", Content: "Damask Rose Water, Hazelnut Praline, Ruby Chocolate, Dried Petals. Contains Nuts."},
				{Title: "Storage & Care", Content: "Keep away from strong floral or spice aromas that may interfere with the rose notes."},
				{Title: "Shipping & Presentation", Content: "Boutique-standard transit."},
			},
			OriginsCraft: []models.CraftBlock{
				{Type: "mixed", Title: "Damask Rose Distillation", Tag: "THE ART", Content: "We distill our own rose water from fresh damask petals, ensuring a pure, delicate aroma that perfectly complements the rich hazelnut praline heart and ruby chocolate shell.", Image: "https://jabal-al-ayham-data.s3.ap-south-1.amazonaws.com/seed_assets/editorial_honey.png"},
			},
			CreatedAt: time.Now(),
			UpdatedAt: time.Now(),
		},
		{
			Name:        "Boutique Signature Box",
			Category:    "Boutique Boxes",
			Price:       250.00,
			Stock:       50,
			Description: "A curated 12-piece journey through our most celebrated confectionery masterpieces. The ultimate ritual of elegance.",
			Images:      []string{"https://jabal-al-ayham-data.s3.ap-south-1.amazonaws.com/seed_assets/signature_box.png"},
			Videos:      []string{},
			Details: []models.ProductDetail{
				{Title: "Contents & Composition", Content: "A curated selection featuring Single-Origin Cacao, Persian Saffron, Heritage Dates, Roasted Pralines, and Volcanic Truffles."},
				{Title: "Storage & Care", Content: "The archive should be stored away from heat. We recommend tasting within 14 days of acquisition."},
				{Title: "Shipping & Presentation", Content: "Signature Maison packaging with priority temperature-controlled transit."},
			},
			OriginsCraft: []models.CraftBlock{
				{Type: "mixed", Title: "The Presentation Ritual", Tag: "THE EXPERIENCE", Content: "Each box is a symphony of flavors, hand-selected by our master chocolatier to represent the pinnacle of regional excellence and artisanal skill. A journey through the sands of time.", Image: "https://jabal-al-ayham-data.s3.ap-south-1.amazonaws.com/seed_assets/editorial_unboxing.png"},
			},
			CreatedAt: time.Now(),
			UpdatedAt: time.Now(),
		},
		{
			Name:        "The Ramadan Collection",
			Category:    "Seasonal",
			Price:       450.00,
			Stock:       30,
			Description: "A magnificent laser-cut wooden box containing 36 pieces of heritage-inspired dates and artisanal chocolates.",
			Images:      []string{"https://jabal-al-ayham-data.s3.ap-south-1.amazonaws.com/seed_assets/ramadan_box.png"},
			Videos:      []string{},
			Details: []models.ProductDetail{
				{Title: "Contents & Composition", Content: "Assorted Medjool Dates, Saffron Ganaches, Pistachio Truffles, Rose Pralines. Contains Nuts and Dairy."},
				{Title: "Storage & Care", Content: "A centerpiece box designed for display; keep in a climate-controlled room."},
				{Title: "Shipping & Presentation", Content: "White-glove concierge delivery available within the region."},
			},
			OriginsCraft: []models.CraftBlock{
				{Type: "mixed", Title: "Laser-Cut Heritage", Tag: "THE ARTISTRY", Content: "Our laser-cut wooden boxes are pieces of art in themselves, designed to be kept as keepsakes. Every detail, from the silk lining to the gold foil accents, reflects the spirit of the season.", Image: "https://jabal-al-ayham-data.s3.ap-south-1.amazonaws.com/seed_assets/editorial_unboxing.png"},
			},
			CreatedAt: time.Now(),
			UpdatedAt: time.Now(),
		},
		// Engagement Collection
		{
			Name:        "Engagement Royal Archive",
			Category:    "Limited Editions",
			Price:       550.00,
			Stock:       25,
			Description: "A curated 24-piece engagement archive featuring our most romantic creations in an ivory and gold-embossed box.",
			Images:      []string{"https://jabal-al-ayham-data.s3.ap-south-1.amazonaws.com/seed_assets/box_1.png"},
			Details: []models.ProductDetail{
				{Title: "The Collection", Content: "A curation of 24 unique truffles and pralines, including the Saffron Silk, Noir Eclipse, and Emerald Pistachio."},
				{Title: "Storage & Care", Content: "Store in a cool, dry place between 15-18°C. Best enjoyed within 21 days of acquisition."},
				{Title: "Presentation", Content: "Housed in a handmade ivory box with gold-foil embossing and silk interior lining."},
			},
			OriginsCraft: []models.CraftBlock{
				{Type: "mixed", Title: "The Royal Ritual", Tag: "THE EXPERIENCE", Content: "Every Royal Archive box is assembled by hand, ensuring that the arrangement of colors and textures creates a visual symphony before the first taste.", Image: "https://jabal-al-ayham-data.s3.ap-south-1.amazonaws.com/seed_assets/editorial_unboxing.png"},
			},
			CreatedAt: time.Now(), UpdatedAt: time.Now(),
		},
		{
			Name:        "Maison Engagement Heart Pralines",
			Category:    "Pralines",
			Price:       120.00,
			Stock:       100,
			Description: "Heart-shaped pralines with rose gold dust and pearl-like white chocolate truffles in a velvet box.",
			Images:      []string{"https://jabal-al-ayham-data.s3.ap-south-1.amazonaws.com/seed_assets/box_2.png"},
			Details: []models.ProductDetail{
				{Title: "Flavor Profile", Content: "Delicate hazelnut praline hearts and Madagascar vanilla white chocolate pearls."},
				{Title: "Artisan Note", Content: "Each heart is hand-dusted with rose gold mica for a shimmering finish."},
			},
			OriginsCraft: []models.CraftBlock{
				{Type: "mixed", Title: "The Heart of the Maison", Tag: "CRAFTSMANSHIP", Content: "Our master chocolatiers spend years perfecting the snap of the chocolate shell to ensure a flawless contrast with the velvet ganache interior.", Image: "https://jabal-al-ayham-data.s3.ap-south-1.amazonaws.com/seed_assets/editorial_craft.png"},
			},
			CreatedAt: time.Now(), UpdatedAt: time.Now(),
		},
		{
			Name:        "Gold-Dusted Engagement Truffles",
			Category:    "Truffles",
			Price:       85.00,
			Stock:       200,
			Description: "Gold-dusted dark chocolate truffles arranged on a marble platter, perfect for engagement ceremonies.",
			Images:      []string{"https://jabal-al-ayham-data.s3.ap-south-1.amazonaws.com/seed_assets/truffles_gold.png"},
			Details: []models.ProductDetail{
				{Title: "Composition", Content: "72% Arriba Dark Chocolate, Heavy Cream, 24K Edible Gold Dust."},
				{Title: "Ceremony Use", Content: "Designed to be served at room temperature for maximum flavor release during celebrations."},
			},
			OriginsCraft: []models.CraftBlock{
				{Type: "mixed", Title: "The Gilded Truffle", Tag: "THE ORIGIN", Content: "Sourced from the high-altitude plantations of Ecuador, our Arriba cacao provides the floral notes that balance the intensity of the dark ganache.", Image: "https://jabal-al-ayham-data.s3.ap-south-1.amazonaws.com/seed_assets/editorial_cacao.png"},
			},
			CreatedAt: time.Now(), UpdatedAt: time.Now(),
		},
		{
			Name:        "Diamond-Cut White Selection",
			Category:    "Limited Editions",
			Price:       150.00,
			Stock:       50,
			Description: "Diamond-cut white chocolates with shimmering edible glitter, presented in a minimalist gift set.",
			Images:      []string{"https://jabal-al-ayham-data.s3.ap-south-1.amazonaws.com/seed_assets/white_diamonds.png"},
			Details: []models.ProductDetail{
				{Title: "The Cut", Content: "Geometric diamond facets hand-carved to catch the light, filled with a creamy yuzu-infused white ganache."},
				{Title: "Storage", Content: "White chocolate is sensitive to light; keep in the provided light-shielded box."},
			},
			OriginsCraft: []models.CraftBlock{
				{Type: "mixed", Title: "Geometric Perfection", Tag: "THE ART", Content: "Inspired by the precision of diamond cutting, these chocolates represent the pinnacle of modern confectionery design.", Image: "https://jabal-al-ayham-data.s3.ap-south-1.amazonaws.com/seed_assets/white_diamonds.png"},
			},
			CreatedAt: time.Now(), UpdatedAt: time.Now(),
		},
		{
			Name:        "Emerald Engagement Collection",
			Category:    "Ganache",
			Price:       180.00,
			Stock:       40,
			Description: "Emerald green pistachio ganache chocolates with gold flakes in a luxury hexagonal gift box.",
			Images:      []string{"https://jabal-al-ayham-data.s3.ap-south-1.amazonaws.com/seed_assets/emerald_ganache.png"},
			Details: []models.ProductDetail{
				{Title: "The Emerald", Content: "Double-roasted Bronte pistachios blended with 34% white chocolate butter."},
				{Title: "Packaging", Content: "Forest green hexagonal archive with gold magnetic closure."},
			},
			OriginsCraft: []models.CraftBlock{
				{Type: "mixed", Title: "Sicilian Legacy", Tag: "INGREDIENTS", Content: "Our pistachios are harvested from the mineral-rich slopes of Mt. Etna, giving them their characteristic deep green color and intense flavor.", Image: "https://jabal-al-ayham-data.s3.ap-south-1.amazonaws.com/seed_assets/editorial_palms.png"},
			},
			CreatedAt: time.Now(), UpdatedAt: time.Now(),
		},
		{
			Name:        "Ruby Heart Engagement Box",
			Category:    "Pralines",
			Price:       140.00,
			Stock:       60,
			Description: "Ruby red heart chocolates with white chocolate drizzle in an elegant dark wood gift box.",
			Images:      []string{"https://jabal-al-ayham-data.s3.ap-south-1.amazonaws.com/seed_assets/ruby_hearts.png"},
			Details: []models.ProductDetail{
				{Title: "The Ruby", Content: "Naturally pink Ruby cacao beans with a hint of berry sourness and silk texture."},
				{Title: "Box Detail", Content: "Hand-polished mahogany wood with custom engagement engraving available."},
			},
			OriginsCraft: []models.CraftBlock{
				{Type: "mixed", Title: "The Ruby Discovery", Tag: "THE CRAFT", Content: "Ruby chocolate is the biggest innovation in the industry in 80 years. We celebrate its unique flavor profile with our signature heart mold.", Image: "https://jabal-al-ayham-data.s3.ap-south-1.amazonaws.com/seed_assets/ruby_hearts.png"},
			},
			CreatedAt: time.Now(), UpdatedAt: time.Now(),
		},
		{
			Name:        "Pearl-Coated White Truffles",
			Category:    "Truffles",
			Price:       95.00,
			Stock:       150,
			Description: "Shimmering pearl-coated white chocolate truffles, perfect for wedding and engagement celebrations.",
			Images:      []string{"https://jabal-al-ayham-data.s3.ap-south-1.amazonaws.com/seed_assets/pearl_truffles.png"},
			Details: []models.ProductDetail{
				{Title: "The Pearl", Content: "Tahitian vanilla bean ganache encased in a shimmer-coated white chocolate sphere."},
				{Title: "Usage", Content: "Ideal as wedding favors or engagement party centerpieces."},
			},
			OriginsCraft: []models.CraftBlock{
				{Type: "mixed", Title: "Oceanic Inspiration", Tag: "THE ARTISTRY", Content: "Every truffle is triple-coated to achieve the luster of a natural South Sea pearl.", Image: "https://jabal-al-ayham-data.s3.ap-south-1.amazonaws.com/seed_assets/pearl_truffles.png"},
			},
			CreatedAt: time.Now(), UpdatedAt: time.Now(),
		},
		{
			Name:        "Sapphire Ganache Engagement Set",
			Category:    "Ganache",
			Price:       220.00,
			Stock:       35,
			Description: "Deep blue sapphire ganache chocolates with silver leaf in a modern minimalist sapphire-blue box.",
			Images:      []string{"https://jabal-al-ayham-data.s3.ap-south-1.amazonaws.com/seed_assets/sapphire_ganache.png"},
			Details: []models.ProductDetail{
				{Title: "The Sapphire", Content: "Butterfly pea flower infused white chocolate with a center of wild blueberry reduction."},
				{Title: "Metallic Detail", Content: "Garnished with genuine 99% pure edible silver leaf."},
			},
			OriginsCraft: []models.CraftBlock{
				{Type: "mixed", Title: "Midnight Infusion", Tag: "INNOVATION", Content: "We use natural botanicals to achieve the deep sapphire hue, avoiding artificial dyes to preserve the purity of the chocolate.", Image: "https://jabal-al-ayham-data.s3.ap-south-1.amazonaws.com/seed_assets/sapphire_ganache.png"},
			},
			CreatedAt: time.Now(), UpdatedAt: time.Now(),
		},
		{
			Name:        "Royal Engagement Selection",
			Category:    "Limited Editions",
			Price:       750.00,
			Stock:       15,
			Description: "A large royal engagement selection featuring 36 pieces of world-class artisanal mastery.",
			Images:      []string{"https://jabal-al-ayham-data.s3.ap-south-1.amazonaws.com/seed_assets/royal_selection.png"},
			Details: []models.ProductDetail{
				{Title: "The Archive", Content: "36 pieces including all signature flavors and seasonal engagement specials."},
				{Title: "White-Glove Service", Content: "Includes personal delivery and tasting notes for the celebration."},
			},
			OriginsCraft: []models.CraftBlock{
				{Type: "mixed", Title: "A Legacy of Celebration", Tag: "THE EXPERIENCE", Content: "The Royal Selection is designed for the most significant moments in life, curated to be a centerpiece of memory and taste.", Image: "https://jabal-al-ayham-data.s3.ap-south-1.amazonaws.com/seed_assets/royal_selection.png"},
			},
			CreatedAt: time.Now(), UpdatedAt: time.Now(),
		},
		{
			Name:        "Rose Gold Engagement Bars",
			Category:    "Heritage",
			Price:       65.00,
			Stock:       300,
			Description: "Rose gold dusted chocolate bars with custom engagement messages engraved.",
			Images:      []string{"https://jabal-al-ayham-data.s3.ap-south-1.amazonaws.com/seed_assets/rose_gold_bars.png"},
			Details: []models.ProductDetail{
				{Title: "The Bar", Content: "45% Milk Chocolate with a hint of Himalayan pink salt and rose gold finish."},
				{Title: "Engraving", Content: "Standard messages include 'Engaged', 'She Said Yes', and 'Forever Begins'."},
			},
			OriginsCraft: []models.CraftBlock{
				{Type: "mixed", Title: "Messages in Gold", Tag: "THE ART", Content: "Our engraving process uses high-precision molds to ensure every message is as crisp as the chocolate's snap.", Image: "https://jabal-al-ayham-data.s3.ap-south-1.amazonaws.com/seed_assets/rose_gold_bars.png"},
			},
			CreatedAt: time.Now(), UpdatedAt: time.Now(),
		},
		{
			Name:        "Bridal White Truffles",
			Category:    "Truffles",
			Price:       88.00,
			Stock:       120,
			Description: "Elegant white chocolate truffles with a pearl finish, designed for bridal parties.",
			Images:      []string{"https://jabal-al-ayham-data.s3.ap-south-1.amazonaws.com/seed_assets/pearl_truffles.png"},
			Details: []models.ProductDetail{
				{Title: "Composition", Content: "Creamy white chocolate, champagne reduction, pearl dust."},
			},
			CreatedAt:   time.Now(), UpdatedAt: time.Now(),
		},
		{
			Name:        "Anniversary Gold Selection",
			Category:    "Limited Editions",
			Price:       190.00,
			Stock:       45,
			Description: "A gold-themed selection of our finest pralines and truffles for major milestones.",
			Images:      []string{"https://jabal-al-ayham-data.s3.ap-south-1.amazonaws.com/seed_assets/truffles_gold.png"},
			Details: []models.ProductDetail{
				{Title: "The Curation", Content: "16 pieces of gold-leaf and gold-dust decorated masterpieces."},
			},
			CreatedAt:   time.Now(), UpdatedAt: time.Now(),
		},
		{
			Name:        "Celebration Pistachio Box",
			Category:    "Boutique Boxes",
			Price:       210.00,
			Stock:       55,
			Description: "A focused selection of emerald pistachio ganaches for joyous occasions.",
			Images:      []string{"https://jabal-al-ayham-data.s3.ap-south-1.amazonaws.com/seed_assets/emerald_ganache.png"},
			Details: []models.ProductDetail{
				{Title: "Contents", Content: "12 pieces of pure Sicilian pistachio ganache."},
			},
			CreatedAt:   time.Now(), UpdatedAt: time.Now(),
		},
		{
			Name:        "Proposal Ruby Hearts",
			Category:    "Limited Editions",
			Price:       165.00,
			Stock:       70,
			Description: "Twelve ruby heart chocolates designed specifically for marriage proposals.",
			Images:      []string{"https://jabal-al-ayham-data.s3.ap-south-1.amazonaws.com/seed_assets/ruby_hearts.png"},
			Details: []models.ProductDetail{
				{Title: "The Ritual", Content: "Arranged to unveil a space for an engagement ring in the center of the box."},
			},
			CreatedAt:   time.Now(), UpdatedAt: time.Now(),
		},
		{
			Name:        "Engagement Signature Selection",
			Category:    "Boutique Boxes",
			Price:       290.00,
			Stock:       40,
			Description: "The signature Maison experience tailored for engagement celebrations.",
			Images:      []string{"https://jabal-al-ayham-data.s3.ap-south-1.amazonaws.com/seed_assets/box_1.png"},
			Details: []models.ProductDetail{
				{Title: "Experience", Content: "A balanced journey through dark, milk, and white engagement creations."},
			},
			CreatedAt:   time.Now(), UpdatedAt: time.Now(),
		},
		{
			Name:        "Rose Gold Celebration Bars",
			Category:    "Heritage",
			Price:       70.00,
			Stock:       250,
			Description: "Rose gold celebration bars featuring 'Congratulations' engravings.",
			Images:      []string{"https://jabal-al-ayham-data.s3.ap-south-1.amazonaws.com/seed_assets/rose_gold_bars.png"},
			CreatedAt:   time.Now(), UpdatedAt: time.Now(),
		},
		{
			Name:        "Engagement Sapphire Ganache",
			Category:    "Ganache",
			Price:       200.00,
			Stock:       30,
			Description: "A sapphire-themed collection for elegant engagement evenings.",
			Images:      []string{"https://jabal-al-ayham-data.s3.ap-south-1.amazonaws.com/seed_assets/sapphire_ganache.png"},
			CreatedAt:   time.Now(), UpdatedAt: time.Now(),
		},
		{
			Name:        "Silk Engagement Saffron",
			Category:    "Limited Editions",
			Price:       185.00,
			Stock:       45,
			Description: "Saffron-infused white chocolate bars in silk engagement wrapping.",
			Images:      []string{"https://jabal-al-ayham-data.s3.ap-south-1.amazonaws.com/seed_assets/saffron_silk.png"},
			CreatedAt:   time.Now(), UpdatedAt: time.Now(),
		},
		{
			Name:        "Heritage Engagement Dates",
			Category:    "Heritage",
			Price:       110.00,
			Stock:       180,
			Description: "Heritage Medjool dates stuffed with gold-dusted pralines for engagement gifts.",
			Images:      []string{"https://jabal-al-ayham-data.s3.ap-south-1.amazonaws.com/seed_assets/heritage_medjool.png"},
			CreatedAt:   time.Now(), UpdatedAt: time.Now(),
		},
		{
			Name:        "Engagement Box Luxe",
			Category:    "Limited Editions",
			Price:       600.00,
			Stock:       20,
			Description: "The ultimate luxury engagement box with 48 pieces of assorted masterpieces.",
			Images:      []string{"https://jabal-al-ayham-data.s3.ap-south-1.amazonaws.com/seed_assets/box_2.png"},
			CreatedAt:   time.Now(), UpdatedAt: time.Now(),
		},
	}

	for _, p := range products {
		filter := bson.M{"name": p.Name}
		update := bson.M{"$set": p}
		opts := options.Update().SetUpsert(true)
		_, err := collection.UpdateOne(context.Background(), filter, update, opts)
		if err != nil {
			return err
		}
	}

	log.Info().Msg("Initial products seeded/updated successfully")
	return nil
}
