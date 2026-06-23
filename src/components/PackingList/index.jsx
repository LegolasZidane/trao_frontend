import React, { Component } from "react";

class PackingList extends Component {
  render() {
    const { trip, togglePacked } = this.props;

    if (!trip) {
      return (
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-3">
            Packing List
          </h2>

          <p className="text-gray-500">
            Select a trip to view packing recommendations.
          </p>
        </div>
      );
    }

    const groupedItems = {
      Documents: [],
      Clothing: [],
      Gear: [],
      Other: [],
    };

    trip.packingList.forEach((item) => {
      if (groupedItems[item.category]) {
        groupedItems[item.category].push(item);
      } else {
        groupedItems.Other.push(item);
      }
    });

    return (
      <div className="bg-white rounded-2xl shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Packing List</h2>

        {trip.packingList.length === 0 ? (
          <p className="text-gray-500">No packing items available.</p>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedItems).map(
              ([category, items]) =>
                items.length > 0 && (
                  <div key={category}>
                    <h3 className="font-semibold text-lg text-gray-700 mb-3 border-b pb-2">
                      {category}
                    </h3>

                    <div className="space-y-2">
                      {items.map((item, index) => (
                        <label
                          key={item._id || index}
                          className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50"
                        >
                          <input
                            type="checkbox"
                            checked={item.isPacked}
                            onChange={() => togglePacked(item._id)}
                            className="h-4 w-4 cursor-pointer"
                          />

                          <span
                            className={
                              item.isPacked
                                ? "line-through text-gray-400"
                                : "text-gray-700"
                            }
                          >
                            {item.item}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                ),
            )}
          </div>
        )}
      </div>
    );
  }
}

export default PackingList;
