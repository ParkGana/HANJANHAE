import { DrinkDetailProps } from '@/types/drink';

import DrinkBasicInfo from './DrinkBasicInfo';
import DrinkDescription from './DrinkDescription';
import DrinkImage from './DrinkImage';
import DrinkTasteProfile from './DrinkTasteProfile';
import DynamicHeader from './DynamicHeader';
import FoodPairing from './FoodPairing';
import ReviewSection from './ReviewSection';

const DrinkDetail = ({ drink, foodPairings }: DrinkDetailProps) => {
  return (
    <div className="relative">
      <DynamicHeader
        name={drink.name}
        image={drink.image!}
        description={drink.description!}
        drinkId={drink.id}
      />

      <div className="mx-auto">
        <DrinkImage image={drink.image} name={drink.name} />
        <DrinkDescription
          name={drink.name}
          imageUrl={drink.image!}
          description={drink.description}
          drinkId={drink.id}
        />
        <DrinkBasicInfo drink={drink} />

        {/* Taste Profile */}
        <DrinkTasteProfile drink={drink} />

        {/* Food Pairings */}
        <section className="mt-10 border-b px-5">
          <FoodPairing pairings={foodPairings} />
        </section>

        {/* Reviews */}
        <ReviewSection drinkId={drink.id} />
      </div>
    </div>
  );
};

export default DrinkDetail;
